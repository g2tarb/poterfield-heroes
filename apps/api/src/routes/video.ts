import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { videoProgress, videos } from "@ph/db";
import { NotFoundError } from "../lib/errors.js";

const videoRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/video/:id/progress
  a.get(
    "/video/:id/progress",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const [row] = await app.db
        .select()
        .from(videoProgress)
        .where(eq(videoProgress.videoId, params.id))
        .limit(1);
      return row ?? null;
    },
  );

  // POST /api/video/:id/progress — update position
  a.post(
    "/video/:id/progress",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          currentSeconds: z.number().nonnegative(),
          duration: z.number().nonnegative().optional(),
          completed: z.boolean().optional(),
        }),
      },
    },
    async ({ params, body }) => {
      const [video] = await app.db
        .select()
        .from(videos)
        .where(eq(videos.id, params.id))
        .limit(1);
      if (!video) throw new NotFoundError("Video");

      const completedAt =
        body.completed ||
        (body.duration && body.currentSeconds / body.duration > 0.95)
          ? new Date()
          : null;

      await app.db
        .insert(videoProgress)
        .values({
          videoId: params.id,
          lastPositionSeconds: Math.floor(body.currentSeconds),
          watchedSeconds: Math.floor(body.currentSeconds),
          completedAt,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: videoProgress.videoId,
          set: {
            lastPositionSeconds: Math.floor(body.currentSeconds),
            watchedSeconds: Math.floor(body.currentSeconds),
            ...(completedAt ? { completedAt } : {}),
            updatedAt: new Date(),
          },
        });

      return { ok: true };
    },
  );
};

export default videoRoutes;
