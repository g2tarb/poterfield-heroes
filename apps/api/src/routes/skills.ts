import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { skills, modules, skillProgress } from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import {
  generateSkillQuestion,
  validateSkillAnswer,
} from "../services/skillValidator.js";

const skillsRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /skills/:id/progress — état actuel
  a.get(
    "/skills/:id/progress",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const [progress] = await app.db
        .select()
        .from(skillProgress)
        .where(eq(skillProgress.skillId, params.id))
        .limit(1);
      return progress ?? null;
    },
  );

  // POST /skills/:id/check — génère une question de validation
  a.post(
    "/skills/:id/check",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const [skill] = await app.db
        .select({
          id: skills.id,
          label: skills.label,
          moduleId: skills.moduleId,
        })
        .from(skills)
        .where(eq(skills.id, params.id))
        .limit(1);
      if (!skill) throw new NotFoundError("Skill");

      const [mod] = await app.db
        .select({
          title: modules.title,
          phase: modules.phase,
          moduleNumber: modules.moduleNumber,
        })
        .from(modules)
        .where(eq(modules.id, skill.moduleId))
        .limit(1);
      if (!mod) throw new NotFoundError("Module");

      const q = await generateSkillQuestion({
        skillLabel: skill.label,
        moduleTitle: mod.title,
        moduleNumber: mod.moduleNumber,
        phase: mod.phase,
      });

      return q;
    },
  );

  // POST /skills/:id/validate — évalue la réponse + maj skill_progress
  a.post(
    "/skills/:id/validate",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          question: z.string().min(1),
          expectedAnswer: z.string().min(1),
          userAnswer: z.string().min(1),
        }),
      },
    },
    async ({ params, body }) => {
      const [skill] = await app.db
        .select({
          id: skills.id,
          label: skills.label,
          moduleId: skills.moduleId,
        })
        .from(skills)
        .where(eq(skills.id, params.id))
        .limit(1);
      if (!skill) throw new NotFoundError("Skill");

      const [mod] = await app.db
        .select({ moduleNumber: modules.moduleNumber, phase: modules.phase })
        .from(modules)
        .where(eq(modules.id, skill.moduleId))
        .limit(1);

      const result = await validateSkillAnswer({
        skillLabel: skill.label,
        question: body.question,
        expectedAnswer: body.expectedAnswer,
        userAnswer: body.userAnswer,
        moduleNumber: mod?.moduleNumber ?? 1,
        phase: mod?.phase ?? 1,
      });

      const masteryPct =
        result.verdict === "mastered"
          ? 100
          : result.verdict === "practicing"
            ? 60
            : 20;

      await app.db
        .insert(skillProgress)
        .values({
          skillId: skill.id,
          status: result.verdict,
          masteryPct,
          masteredAt: result.verdict === "mastered" ? new Date() : null,
        })
        .onConflictDoUpdate({
          target: skillProgress.skillId,
          set: {
            status: result.verdict,
            masteryPct,
            masteredAt: result.verdict === "mastered" ? new Date() : null,
          },
        });

      return {
        verdict: result.verdict,
        feedback: result.feedback,
        masteryPct,
      };
    },
  );
};

export default skillsRoutes;
