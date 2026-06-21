import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { asc, eq, inArray } from "drizzle-orm";
import {
  modules,
  skills,
  videos,
  exercises,
  moduleProgress,
  skillProgress,
  externalResources,
  skillResources,
} from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import { verifyAllResources } from "../services/resourceVerifier.js";

const modulesRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /modules — liste des 5 modules avec statut de progression
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
      // EXCEPTION : modules transversaux (phase ≥ 9) — toujours actifs, hors cascade.
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
        // Module transversal : toujours actif, n'affecte pas la cascade
        if (r.phase >= 9) {
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
      // EXCEPTION : modules transversaux (phase ≥ 9) — toujours "active" hors cascade
      const allRows = await app.db
        .select({
          id: modules.id,
          moduleNumber: modules.moduleNumber,
          phase: modules.phase,
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
        } else if (r.phase >= 9) {
          // Transversal : toujours actif, n'affecte pas la cascade
          s = "active";
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
              prereqSkillSlugs: skills.prereqSkillSlugs,
              contentMarkdown: skills.contentMarkdown,
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

      // Ressources externes par skill (Sprint C)
      const skillIds = skillsList.map((s) => s.id);
      const resourcesRows = skillIds.length > 0
        ? await app.db
            .select({
              skillId: skillResources.skillId,
              displayOrder: skillResources.displayOrder,
              id: externalResources.id,
              kind: externalResources.kind,
              provider: externalResources.provider,
              title: externalResources.title,
              url: externalResources.url,
              language: externalResources.language,
              level: externalResources.level,
              whyThisOne: externalResources.whyThisOne,
              estimatedMinutes: externalResources.estimatedMinutes,
              lastVerifiedAt: externalResources.lastVerifiedAt,
              httpStatus: externalResources.httpStatus,
            })
            .from(skillResources)
            .innerJoin(
              externalResources,
              eq(externalResources.id, skillResources.resourceId),
            )
            .where(inArray(skillResources.skillId, skillIds))
            .orderBy(asc(skillResources.displayOrder))
        : [];

      // Group resources by skillId
      const resourcesBySkill = new Map<string, typeof resourcesRows>();
      for (const r of resourcesRows) {
        const arr = resourcesBySkill.get(r.skillId) ?? [];
        arr.push(r);
        resourcesBySkill.set(r.skillId, arr);
      }

      const skillsWithResources = skillsList.map((s) => ({
        ...s,
        resources: (resourcesBySkill.get(s.id) ?? []).map((r) => ({
          id: r.id,
          kind: r.kind,
          provider: r.provider,
          title: r.title,
          url: r.url,
          language: r.language,
          level: r.level,
          whyThisOne: r.whyThisOne,
          estimatedMinutes: r.estimatedMinutes,
          lastVerifiedAt: r.lastVerifiedAt,
          httpStatus: r.httpStatus,
        })),
      }));

      return {
        module: mod,
        skills: skillsWithResources,
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

  // POST /admin/verify-resources — Sprint D : check toutes les URLs externes
  a.post(
    "/admin/verify-resources",
    { preHandler: [app.authenticate] },
    async () => {
      const result = await verifyAllResources(app.db);
      return result;
    },
  );
};

export default modulesRoutes;
