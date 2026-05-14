import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  streamCoachResponse,
  startOrResumeSession,
} from "../services/coach.js";

const coachRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // POST /api/coach/stream
  // Body: { message, moduleId?, sessionId? }
  // Response: text/event-stream SSE
  a.post(
    "/coach/stream",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          message: z.string().min(1).max(8000),
          moduleId: z.string().optional(),
          sessionId: z.string().uuid().optional(),
        }),
      },
    },
    async (req, reply) => {
      const { message, moduleId, sessionId: existingSessionId } = req.body;

      const sessionId = await startOrResumeSession(
        app.db,
        moduleId,
        existingSessionId,
      );

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

      // SSE meta envelope
      const send = (event: string, data: unknown) => {
        reply.raw.write(`event: ${event}\n`);
        reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      send("session", { sessionId });

      let closed = false;
      req.raw.on("close", () => {
        closed = true;
      });

      try {
        await streamCoachResponse(
          app.db,
          { sessionId, userMessage: message, moduleId },
          {
            onChunk: (text) => {
              if (closed) return;
              send("chunk", { text });
            },
            onUsage: (usage) => {
              if (closed) return;
              send("usage", usage);
            },
            onError: (err) => {
              if (closed) return;
              send("error", { message: err.message });
            },
          },
        );
        if (!closed) send("done", { sessionId });
      } catch (err) {
        if (!closed) {
          send("error", {
            message: (err as Error).message ?? "Coach error",
          });
        }
      } finally {
        if (!closed) reply.raw.end();
      }
    },
  );

  // GET /api/coach/sessions/:id/messages — historique d'une session
  a.get(
    "/coach/sessions/:id/messages",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const { coachMessages } = await import("@ph/db");
      const { asc, eq } = await import("drizzle-orm");
      const rows = await app.db
        .select({
          id: coachMessages.id,
          role: coachMessages.role,
          content: coachMessages.content,
          createdAt: coachMessages.createdAt,
        })
        .from(coachMessages)
        .where(eq(coachMessages.sessionId, params.id))
        .orderBy(asc(coachMessages.createdAt));
      return rows;
    },
  );
};

export default coachRoutes;
