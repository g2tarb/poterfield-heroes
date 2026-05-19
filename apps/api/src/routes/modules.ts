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
  skillProgress,
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

      // Déverrouillage en cascade : si le module précédent est completed
      // (ou si c'est M01), un module sans progress est rendu "active".
      let firstUnstartedFound = false;
      return rows.map((r) => {
        if (r.status === "completed") {
          return {
            id: r.id,
            moduleNumber: r.moduleNumber,
            phase: r.phase,
            title: r.title,
            subtitle: r.subtitle,
            estimatedHours: r.estimatedHours,
            status: "completed" as const,
          };
        }
        if (r.status === "active") {
          firstUnstartedFound = true;
          return {
            id: r.id,
            moduleNumber: r.moduleNumber,
            phase: r.phase,
            title: r.title,
            subtitle: r.subtitle,
            estimatedHours: r.estimatedHours,
            status: "active" as const,
          };
        }
        // Pas de progress: le premier rencontré devient active, les autres locked
        const status = firstUnstartedFound ? "locked" : "active";
        if (!firstUnstartedFound) firstUnstartedFound = true;
        return {
          id: r.id,
          moduleNumber: r.moduleNumber,
          phase: r.phase,
          title: r.title,
          subtitle: r.subtitle,
          estimatedHours: r.estimatedHours,
          status: status as "locked" | "active",
        };
      });
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

      // Cascade pour le status : on regarde tous les modules + leurs progress
      const allRows = await app.db
        .select({
          id: modules.id,
          moduleNumber: modules.moduleNumber,
          status: moduleProgress.status,
        })
        .from(modules)
        .leftJoin(moduleProgress, eq(moduleProgress.moduleId, modules.id))
        .orderBy(asc(modules.moduleNumber));

      let cascadedStatus: "locked" | "active" | "completed" = "locked";
      let firstUnstartedFound = false;
      for (const r of allRows) {
        let s: "locked" | "active" | "completed";
        if (r.status === "completed") {
          s = "completed";
        } else if (r.status === "active") {
          firstUnstartedFound = true;
          s = "active";
        } else {
          s = firstUnstartedFound ? "locked" : "active";
          if (!firstUnstartedFound) firstUnstartedFound = true;
        }
        if (r.id === params.id) cascadedStatus = s;
      }

      const [skillsList, videosList, exercisesList, progress] =
        await Promise.all([
          app.db
            .select({
              id: skills.id,
              slug: skills.slug,
              label: skills.label,
              description: skills.description,
              weight: skills.weight,
              displayOrder: skills.displayOrder,
              videos: skills.videos,
              status: skillProgress.status,
              masteryPct: skillProgress.masteryPct,
            })
            .from(skills)
            .leftJoin(skillProgress, eq(skillProgress.skillId, skills.id))
            .where(eq(skills.moduleId, mod.id))
            .orderBy(asc(skills.displayOrder)),
          app.db
            .select()
            .from(videos)
            .where(eq(videos.moduleId, mod.id))
            .orderBy(asc(videos.displayOrder)),
          app.db
            .select({
              id: exercises.id,
              kind: exercises.kind,
              title: exercises.title,
              statement: exercises.statement,
              starterCode: exercises.starterCode,
              language: exercises.language,
              quizQuestions: exercises.quizQuestions,
              estimatedMinutes: exercises.estimatedMinutes,
              displayOrder: exercises.displayOrder,
              passThresholdPct: exercises.passThresholdPct,
            })
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
        progress: progress
          ? { ...progress, status: cascadedStatus }
          : {
              status: cascadedStatus,
              secondsSpent: 0,
            },
      };
    },
  );
};

export default modulesRoutes;
