import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  exerciseAttempts,
  exercises,
  moduleProgress,
  skillProgress,
  skills,
} from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import {
  awardXp,
  getProgressionSnapshot,
  XP_VALUES,
  type XpKind,
} from "../services/xpEngine.js";
import { computeMasteryRadar } from "../services/masteryRadar.js";
import { generateCardsForSkill } from "../services/srsGenerator.js";
import { touchStreak } from "../services/streak.js";

const progressRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/progress/state — palier, XP, prochaine cible
  a.get(
    "/progress/state",
    { preHandler: [app.authenticate] },
    async () => {
      const snapshot = await getProgressionSnapshot(app.db);
      return snapshot;
    },
  );

  // GET /api/progress/radar — 12 axes mastery
  a.get(
    "/progress/radar",
    { preHandler: [app.authenticate] },
    async () => {
      return computeMasteryRadar(app.db);
    },
  );

  // POST /api/progress/exercise — soumettre une tentative
  a.post(
    "/progress/exercise",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          exerciseId: z.string().uuid(),
          submittedCode: z.string().optional(),
          quizAnswers: z
            .array(
              z.object({
                questionIndex: z.number(),
                answer: z.union([z.string(), z.number()]),
                isCorrect: z.boolean(),
              }),
            )
            .optional(),
          scorePct: z.number().int().min(0).max(100),
          durationMs: z.number().int().nonnegative().optional(),
          startedAt: z.string().datetime(),
        }),
      },
    },
    async ({ body }) => {
      const [ex] = await app.db
        .select()
        .from(exercises)
        .where(eq(exercises.id, body.exerciseId))
        .limit(1);
      if (!ex) throw new NotFoundError("Exercise");

      const passed = body.scorePct >= ex.passThresholdPct;

      const [previous] = await app.db
        .select({ count: app.db.$count(exerciseAttempts) })
        .from(exerciseAttempts)
        .where(eq(exerciseAttempts.exerciseId, ex.id))
        .limit(1);
      const attemptNumber = (previous?.count ?? 0) + 1;

      const [attempt] = await app.db
        .insert(exerciseAttempts)
        .values({
          exerciseId: ex.id,
          attemptNumber,
          submittedCode: body.submittedCode ?? null,
          quizAnswers: body.quizAnswers ?? null,
          scorePct: body.scorePct,
          passed,
          durationMs: body.durationMs ?? null,
          startedAt: new Date(body.startedAt),
        })
        .returning();

      // Touch streak à chaque tentative (passed or not — l'effort compte)
      await touchStreak(app.db);

      let xpResult: Awaited<ReturnType<typeof awardXp>> | null = null;
      let cardsGenerated = 0;

      if (passed) {
        const kind: XpKind =
          ex.kind === "project_validation"
            ? "project_validated"
            : ex.kind === "quiz_verification"
              ? "skill_mastered"
              : "skill_mastered";

        const amount =
          ex.kind === "project_validation"
            ? XP_VALUES.project_validation
            : ex.kind === "quiz_verification"
              ? XP_VALUES.quiz_verification_passed
              : XP_VALUES.exercise_passed;

        xpResult = await awardXp(app.db, {
          kind,
          amount,
          sourceRef: `exercise:${ex.id}`,
          metadata: {
            exerciseKind: ex.kind,
            scorePct: body.scorePct,
            moduleId: ex.moduleId,
          },
        });

        // If quiz vérif passed → bump skill_progress towards 'mastered' + generate SRS cards
        if (ex.kind === "quiz_verification") {
          for (const skillSlug of ex.skillSlugs ?? []) {
            const [skill] = await app.db
              .select()
              .from(skills)
              .where(eq(skills.slug, skillSlug))
              .limit(1);
            if (!skill) continue;

            await app.db
              .insert(skillProgress)
              .values({
                skillId: skill.id,
                status: "practicing",
                masteryPct: 60,
                firstSeenAt: new Date(),
              })
              .onConflictDoUpdate({
                target: skillProgress.skillId,
                set: { status: "practicing", masteryPct: 60 },
              });

            // Trigger SRS cards generation (fire-and-forget)
            void generateCardsForSkill(app.db, { skillId: skill.id })
              .then((r) => {
                cardsGenerated += r.cardsCreated;
              })
              .catch((err) =>
                app.log.error({ err }, "SRS generation failed"),
              );
          }
        }
      }

      return {
        attempt,
        passed,
        xp: xpResult,
        cardsGenerationTriggered: passed && ex.kind === "quiz_verification",
      };
    },
  );

  // POST /api/progress/module/:id/start — passer le module en active
  a.post(
    "/progress/module/:id/start",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string() }) },
    },
    async ({ params }) => {
      await app.db
        .insert(moduleProgress)
        .values({
          moduleId: params.id,
          status: "active",
          startedAt: new Date(),
          unlockedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: moduleProgress.moduleId,
          set: { status: "active", startedAt: new Date() },
        });
      return { ok: true };
    },
  );

  // POST /api/progress/module/:id/complete — marquer comme complété + XP
  a.post(
    "/progress/module/:id/complete",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string() }) },
    },
    async ({ params }) => {
      const completedAt = new Date();
      await app.db
        .update(moduleProgress)
        .set({ status: "completed", completedAt })
        .where(eq(moduleProgress.moduleId, params.id));

      const xpResult = await awardXp(app.db, {
        kind: "module_completed",
        amount: XP_VALUES.module_completed,
        sourceRef: `module:${params.id}`,
        metadata: { moduleId: params.id },
      });

      return { ok: true, xp: xpResult };
    },
  );
};

export default progressRoutes;
