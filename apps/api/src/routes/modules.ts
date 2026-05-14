import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import {
  modules,
  skills,
  videos,
  exercises,
  moduleProgress,
} from "@ph/db";
import { NotFoundError } from "../lib/errors.js";

const modulesRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /modules — liste des 25 modules avec statut de progression
  a.get(
    "/modules",
    {
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              moduleNumber: z.number(),
              phase: z.number(),
              title: z.string(),
              subtitle: z.string().nullable(),
              estimatedHours: z.number(),
              status: z.enum(["locked", "active", "completed"]),
            }),
          ),
        },
      },
    },
    async () => {
      const rows = await app.db
        .select({
          id: modules.id,
          moduleNumber: modules.moduleNumber,
          phase: modules.phase,
          title: modules.title,
          subtitle: modules.subtitle,
          estimatedHours: modules.estimatedHours,
          status: moduleProgress.status,
        })
        .from(modules)
        .leftJoin(moduleProgress, eq(moduleProgress.moduleId, modules.id))
        .orderBy(asc(modules.moduleNumber));

      return rows.map((r) => ({
        id: r.id,
        moduleNumber: r.moduleNumber,
        phase: r.phase,
        title: r.title,
        subtitle: r.subtitle,
        estimatedHours: r.estimatedHours,
        status: r.status ?? ("locked" as const),
      }));
    },
  );

  // GET /modules/:id — détail d'un module
  a.get(
    "/modules/:id",
    {
      schema: {
        params: z.object({ id: z.string().min(1) }),
      },
    },
    async ({ params }) => {
      const [mod] = await app.db
        .select()
        .from(modules)
        .where(eq(modules.id, params.id))
        .limit(1);

      if (!mod) throw new NotFoundError("Module");

      const [skillsList, videosList, exercisesList, progress] =
        await Promise.all([
          app.db
            .select()
            .from(skills)
            .where(eq(skills.moduleId, mod.id))
            .orderBy(asc(skills.displayOrder)),
          app.db
            .select()
            .from(videos)
            .where(eq(videos.moduleId, mod.id))
            .orderBy(asc(videos.displayOrder)),
          app.db
            .select()
            .from(exercises)
            .where(eq(exercises.moduleId, mod.id))
            .orderBy(asc(exercises.displayOrder)),
          app.db
            .select()
            .from(moduleProgress)
            .where(eq(moduleProgress.moduleId, mod.id))
            .limit(1)
            .then((rows) => rows[0] ?? null),
        ]);

      return {
        module: mod,
        skills: skillsList,
        videos: videosList,
        exercises: exercisesList,
        progress,
      };
    },
  );
};

export default modulesRoutes;
