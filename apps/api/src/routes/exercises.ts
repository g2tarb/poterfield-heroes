import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { exercises, exerciseAttempts, modules } from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import {
  correctExercise,
  correctQuiz,
} from "../services/exerciseCorrector.js";
import { touchStreak } from "../services/streak.js";

const exercisesRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // POST /exercises/:id/correct — fait corriger une réponse par l'IA (ou en local pour les quiz)
  a.post(
    "/exercises/:id/correct",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          // Pour code_exercise / project_validation : le code/texte tapé
          answer: z.string().optional(),
          // Pour quiz_* : index ou texte choisi par question
          quizAnswers: z
            .array(
              z.object({
                questionIndex: z.number().int().nonnegative(),
                answer: z.union([z.string(), z.number()]),
              }),
            )
            .optional(),
          startedAt: z.string().datetime(),
        }),
      },
    },
    async ({ params, body }) => {
      const [ex] = await app.db
        .select()
        .from(exercises)
        .where(eq(exercises.id, params.id))
        .limit(1);
      if (!ex) throw new NotFoundError("Exercise");

      const isQuiz =
        ex.kind === "quiz_activation" || ex.kind === "quiz_verification";

      let result;
      if (isQuiz) {
        if (!body.quizAnswers || !ex.quizQuestions) {
          return {
            error: "quiz answers required for quiz exercises",
            code: "INVALID_INPUT",
          };
        }
        result = correctQuiz({
          quizQuestions: ex.quizQuestions,
          userAnswers: body.quizAnswers,
        });
      } else {
        if (!body.answer || body.answer.trim().length === 0) {
          return {
            error: "answer required for code/project exercises",
            code: "INVALID_INPUT",
          };
        }

        const [mod] = await app.db
          .select({
            moduleNumber: modules.moduleNumber,
            phase: modules.phase,
          })
          .from(modules)
          .where(eq(modules.id, ex.moduleId))
          .limit(1);

        result = await correctExercise(app.db, {
          statement: ex.statement,
          solutionCode: ex.solutionCode,
          expectedOutput: ex.expectedOutput,
          language: ex.language,
          kind: ex.kind,
          title: ex.title,
          userAnswer: body.answer,
          moduleNumber: mod?.moduleNumber ?? 1,
          phase: mod?.phase ?? 1,
          exerciseId: ex.id,
        });
      }

      const passed = result.scorePct >= ex.passThresholdPct;
      const startedAt = new Date(body.startedAt);
      const durationMs = Math.max(0, Date.now() - startedAt.getTime());

      const [previous] = await app.db
        .select({ count: app.db.$count(exerciseAttempts) })
        .from(exerciseAttempts)
        .where(eq(exerciseAttempts.exerciseId, ex.id))
        .limit(1);
      const attemptNumber = (previous?.count ?? 0) + 1;

      await app.db.insert(exerciseAttempts).values({
        exerciseId: ex.id,
        attemptNumber,
        submittedCode: body.answer ?? null,
        quizAnswers: body.quizAnswers
          ? body.quizAnswers.map((qa) => ({
              questionIndex: qa.questionIndex,
              answer: qa.answer,
              isCorrect: false, // recalculable depuis correctQuiz si besoin
            }))
          : null,
        scorePct: result.scorePct,
        passed,
        durationMs,
        startedAt,
      });

      await touchStreak(app.db);

      return {
        verdict: result.verdict,
        scorePct: result.scorePct,
        passed,
        feedback: result.feedback,
        suggestions: result.suggestions,
        attemptNumber,
        passThresholdPct: ex.passThresholdPct,
      };
    },
  );
};

export default exercisesRoutes;
