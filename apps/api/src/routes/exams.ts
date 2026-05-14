import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { desc, eq, gte } from "drizzle-orm";
import { weeklyExams, examSubmissions } from "@ph/db";
import { NotFoundError } from "../lib/errors.js";
import { generateWeeklyExam } from "../services/examGenerator.js";
import { awardXp, XP_VALUES } from "../services/xpEngine.js";

const examsRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/exams/current — exam de la semaine en cours (sans révéler les corrections)
  a.get(
    "/exams/current",
    { preHandler: [app.authenticate] },
    async (_req, reply) => {
      const monday = new Date();
      const dow = monday.getDay() || 7;
      monday.setDate(monday.getDate() - dow + 1);
      const weekStart = monday.toISOString().slice(0, 10);

      const [exam] = await app.db
        .select()
        .from(weeklyExams)
        .where(eq(weeklyExams.weekStartDate, weekStart))
        .limit(1);
      if (!exam) {
        return reply.code(404).send({
          error: "NotFoundError",
          message: "Pas encore d'exam pour cette semaine",
        });
      }

      const [submission] = await app.db
        .select()
        .from(examSubmissions)
        .where(eq(examSubmissions.examId, exam.id))
        .limit(1);

      // Strip correctIndex/explanation/expectedBehavior to avoid cheating before submit
      const safeQuestions = (exam.questions ?? []).map((q) => {
        if (q.kind === "qcm") {
          return {
            kind: "qcm" as const,
            question: q.question,
            options: q.options,
            ...(q.skillId ? { skillId: q.skillId } : {}),
          };
        }
        return {
          kind: "code" as const,
          prompt: q.prompt,
          language: q.language,
          starterCode: q.starterCode ?? "",
          ...(q.skillId ? { skillId: q.skillId } : {}),
        };
      });

      return {
        id: exam.id,
        weekStartDate: exam.weekStartDate,
        timeLimitMinutes: exam.timeLimitMinutes,
        questions: safeQuestions,
        submitted: !!submission,
        submission: submission ?? null,
      };
    },
  );

  // POST /api/exams/generate-week — trigger manuel (utile pour test)
  a.post(
    "/exams/generate-week",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z
          .object({
            weekStartDate: z.string().optional(),
            force: z.boolean().optional(),
          })
          .optional(),
      },
    },
    async ({ body }) => {
      return generateWeeklyExam(app.db, body ?? {});
    },
  );

  // POST /api/exams/:id/submit — soumettre les réponses
  a.post(
    "/exams/:id/submit",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          answers: z.array(
            z.object({
              questionIndex: z.number().int(),
              answer: z.union([z.string(), z.number()]),
            }),
          ),
          startedAt: z.string().datetime(),
          durationSeconds: z.number().int().nonnegative(),
        }),
      },
    },
    async ({ params, body }) => {
      const [exam] = await app.db
        .select()
        .from(weeklyExams)
        .where(eq(weeklyExams.id, params.id))
        .limit(1);
      if (!exam) throw new NotFoundError("Exam");

      const questions = exam.questions ?? [];
      const graded = body.answers.map((a) => {
        const q = questions[a.questionIndex];
        if (!q) return { ...a, isCorrect: false };
        if (q.kind === "qcm" && typeof a.answer === "number") {
          return { ...a, isCorrect: a.answer === q.correctIndex };
        }
        // code : marqué non-évalué pour V0 (sera revue manuellement / par coach)
        return { ...a, isCorrect: false, partialPct: 0 };
      });

      const qcmTotal = questions.filter((q) => q.kind === "qcm").length;
      const qcmCorrect = graded.filter(
        (g, i) => questions[g.questionIndex]?.kind === "qcm" && g.isCorrect,
      ).length;
      const scorePct = qcmTotal > 0 ? Math.round((qcmCorrect / qcmTotal) * 100) : 0;

      const [inserted] = await app.db
        .insert(examSubmissions)
        .values({
          examId: exam.id,
          answers: graded,
          scorePct,
          durationSeconds: body.durationSeconds,
          startedAt: new Date(body.startedAt),
        })
        .returning();

      // Award XP
      let xpResult = null;
      if (scorePct === 100) {
        xpResult = await awardXp(app.db, {
          kind: "exam_perfect",
          amount: XP_VALUES.exam_perfect,
          sourceRef: `exam:${exam.id}`,
        });
      } else if (scorePct >= 70) {
        xpResult = await awardXp(app.db, {
          kind: "exam_passed",
          amount: XP_VALUES.exam_passed,
          sourceRef: `exam:${exam.id}`,
        });
      }

      return {
        submission: inserted,
        scorePct,
        passed: scorePct >= 70,
        xp: xpResult,
        questions, // full reveal of correct answers + explanations
      };
    },
  );

  // GET /api/exams — historique
  a.get(
    "/exams",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: z.object({
          limit: z.coerce.number().int().min(1).max(50).default(10),
        }),
      },
    },
    async ({ query }) => {
      const rows = await app.db
        .select({
          id: weeklyExams.id,
          weekStartDate: weeklyExams.weekStartDate,
          generatedAt: weeklyExams.generatedAt,
        })
        .from(weeklyExams)
        .orderBy(desc(weeklyExams.weekStartDate))
        .limit(query.limit);
      return rows;
    },
  );
};

export default examsRoutes;
