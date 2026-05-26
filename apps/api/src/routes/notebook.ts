import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { notebookEntries, memoryEmbeddings } from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import { indexMemory, reindexMemory } from "../services/memory.js";

const sourceEnum = z.enum(["coach", "user", "system"]);

const notebookRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/notebook
  a.get(
    "/notebook",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: z.object({
          moduleId: z.string().optional(),
          source: sourceEnum.optional(),
          videoYoutubeId: z.string().optional(),
          limit: z.coerce.number().int().min(1).max(200).default(100),
        }),
      },
    },
    async ({ query }) => {
      const where = [];
      if (query.moduleId) where.push(eq(notebookEntries.moduleId, query.moduleId));
      if (query.source) where.push(eq(notebookEntries.source, query.source));
      if (query.videoYoutubeId)
        where.push(eq(notebookEntries.videoYoutubeId, query.videoYoutubeId));

      const rows = await app.db
        .select()
        .from(notebookEntries)
        .where(where.length > 0 ? and(...where) : undefined)
        .orderBy(desc(notebookEntries.updatedAt))
        .limit(query.limit);
      return rows;
    },
  );

  // GET /api/notebook/:id
  a.get(
    "/notebook/:id",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const [row] = await app.db
        .select()
        .from(notebookEntries)
        .where(eq(notebookEntries.id, params.id))
        .limit(1);
      if (!row) throw new NotFoundError("Note");
      return row;
    },
  );

  // POST /api/notebook
  a.post(
    "/notebook",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          moduleId: z.string().nullable().optional(),
          skillId: z.string().uuid().nullable().optional(),
          source: sourceEnum.default("user"),
          title: z.string().min(1).max(500),
          contentMarkdown: z.string().min(1),
          tags: z.array(z.string()).optional(),
          videoYoutubeId: z.string().min(1).max(32).nullable().optional(),
          videoTimestampSeconds: z
            .number()
            .int()
            .min(0)
            .nullable()
            .optional(),
        }),
      },
    },
    async ({ body }, reply) => {
      const [inserted] = await app.db
        .insert(notebookEntries)
        .values({
          moduleId: body.moduleId ?? null,
          skillId: body.skillId ?? null,
          source: body.source,
          title: body.title,
          contentMarkdown: body.contentMarkdown,
          tags: body.tags ?? [],
          videoYoutubeId: body.videoYoutubeId ?? null,
          videoTimestampSeconds: body.videoTimestampSeconds ?? null,
        })
        .returning();

      if (!inserted) {
        throw new Error("Failed to insert notebook entry");
      }

      // Index for RAG (fire-and-forget, ne bloque pas)
      void indexMemory(app.db, {
        source: "note",
        sourceId: inserted.id,
        moduleId: inserted.moduleId,
        content: `${inserted.title}\n\n${inserted.contentMarkdown}`,
        metadata: { notebook_entry_id: inserted.id, notebook_source: body.source },
      });

      return reply.code(201).send(inserted);
    },
  );

  // PATCH /api/notebook/:id
  a.patch(
    "/notebook/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          title: z.string().min(1).max(500).optional(),
          contentMarkdown: z.string().min(1).optional(),
          tags: z.array(z.string()).optional(),
          starred: z.number().int().min(0).max(1).optional(),
        }),
      },
    },
    async ({ params, body }) => {
      const [updated] = await app.db
        .update(notebookEntries)
        .set({
          ...(body.title !== undefined ? { title: body.title } : {}),
          ...(body.contentMarkdown !== undefined
            ? { contentMarkdown: body.contentMarkdown }
            : {}),
          ...(body.tags !== undefined ? { tags: body.tags } : {}),
          ...(body.starred !== undefined ? { starred: body.starred } : {}),
          updatedAt: new Date(),
        })
        .where(eq(notebookEntries.id, params.id))
        .returning();
      if (!updated) throw new NotFoundError("Note");

      // Reindex if content changed
      if (body.title || body.contentMarkdown) {
        // Find existing memory_embedding for this note
        const [existing] = await app.db
          .select({ id: memoryEmbeddings.id })
          .from(memoryEmbeddings)
          .where(eq(memoryEmbeddings.sourceId, updated.id))
          .limit(1);

        const content = `${updated.title}\n\n${updated.contentMarkdown}`;
        if (existing) {
          void reindexMemory(app.db, existing.id, content);
        } else {
          void indexMemory(app.db, {
            source: "note",
            sourceId: updated.id,
            moduleId: updated.moduleId,
            content,
          });
        }
      }

      return updated;
    },
  );

  // DELETE /api/notebook/:id
  a.delete(
    "/notebook/:id",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }, reply) => {
      const deleted = await app.db
        .delete(notebookEntries)
        .where(eq(notebookEntries.id, params.id))
        .returning({ id: notebookEntries.id });
      if (deleted.length === 0) throw new NotFoundError("Note");

      // Cleanup associated memory embedding
      await app.db
        .delete(memoryEmbeddings)
        .where(eq(memoryEmbeddings.sourceId, params.id));

      return reply.code(204).send();
    },
  );
};

export default notebookRoutes;
