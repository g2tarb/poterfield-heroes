import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { and, asc, eq, isNotNull, lte, sql } from "drizzle-orm";
import { srsCards, srsReviews, skills, modules } from "@ph/db";
import {
  buildFsrsCard,
  reviewCard,
  FSRS_RATING,
  type CardStateString,
  type FsrsRating,
} from "@ph/shared";
import { NotFoundError } from "../lib/errors.js";
import { generateCardsForSkill } from "../services/srsGenerator.js";

const srsRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/srs/due — cartes dues + N "new" cartes max
  a.get(
    "/srs/due",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: z.object({
          limit: z.coerce.number().int().min(1).max(200).default(50),
          newPerSession: z.coerce.number().int().min(0).max(50).default(10),
        }),
      },
    },
    async ({ query }) => {
      const now = new Date();

      // 1. cartes review/learning dues
      const dueCards = await app.db
        .select({
          id: srsCards.id,
          front: srsCards.front,
          back: srsCards.back,
          state: srsCards.state,
          dueAt: srsCards.dueAt,
          moduleId: srsCards.moduleId,
          moduleTitle: modules.title,
          skillId: srsCards.skillId,
          skillLabel: skills.label,
        })
        .from(srsCards)
        .innerJoin(skills, eq(skills.id, srsCards.skillId))
        .innerJoin(modules, eq(modules.id, srsCards.moduleId))
        .where(and(lte(srsCards.dueAt, now), isNotNull(srsCards.lastReviewAt)))
        .orderBy(asc(srsCards.dueAt))
        .limit(query.limit);

      // 2. quelques cartes "new" introduites en première position
      const newCards = await app.db
        .select({
          id: srsCards.id,
          front: srsCards.front,
          back: srsCards.back,
          state: srsCards.state,
          dueAt: srsCards.dueAt,
          moduleId: srsCards.moduleId,
          moduleTitle: modules.title,
          skillId: srsCards.skillId,
          skillLabel: skills.label,
        })
        .from(srsCards)
        .innerJoin(skills, eq(skills.id, srsCards.skillId))
        .innerJoin(modules, eq(modules.id, srsCards.moduleId))
        .where(eq(srsCards.state, "new"))
        .orderBy(asc(srsCards.createdAt))
        .limit(query.newPerSession);

      return { dueCards, newCards };
    },
  );

  // POST /api/srs/review — soumettre rating, recalcule via FSRS
  a.post(
    "/srs/review",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          cardId: z.string().uuid(),
          rating: z
            .number()
            .int()
            .refine((n): n is FsrsRating => [1, 2, 3, 4].includes(n)),
          durationMs: z.number().int().nonnegative().optional(),
        }),
      },
    },
    async ({ body }) => {
      const [card] = await app.db
        .select()
        .from(srsCards)
        .where(eq(srsCards.id, body.cardId))
        .limit(1);

      if (!card) throw new NotFoundError("SRS card");

      const current = buildFsrsCard({
        stability: card.stability,
        difficulty: card.difficulty,
        reps: card.reps,
        lapses: card.lapses,
        intervalDays: card.intervalDays,
        state: card.state as CardStateString,
        lastReviewAt: card.lastReviewAt,
        dueAt: card.dueAt,
      });

      const result = reviewCard({ current, rating: body.rating as FsrsRating });

      // Update card
      await app.db
        .update(srsCards)
        .set({
          stability: result.nextCard.stability,
          difficulty: result.nextCard.difficulty,
          reps: result.nextCard.reps,
          lapses: result.nextCard.lapses,
          intervalDays: result.nextCard.intervalDays,
          state: result.nextCard.state,
          lastReviewAt: result.nextCard.lastReviewAt,
          dueAt: result.nextCard.dueAt,
        })
        .where(eq(srsCards.id, body.cardId));

      // Audit trail
      await app.db.insert(srsReviews).values({
        cardId: body.cardId,
        rating: body.rating,
        elapsedDays: result.log.elapsedDays,
        scheduledDays: result.log.scheduledDays,
        stabilityBefore: result.log.stabilityBefore,
        stabilityAfter: result.log.stabilityAfter,
        difficultyBefore: result.log.difficultyBefore,
        difficultyAfter: result.log.difficultyAfter,
        durationMs: body.durationMs ?? null,
      });

      return {
        ok: true,
        nextDueAt: result.nextCard.dueAt,
        intervalDays: result.nextCard.intervalDays,
        state: result.nextCard.state,
      };
    },
  );

  // GET /api/srs/stats — vue d'ensemble
  a.get(
    "/srs/stats",
    { preHandler: [app.authenticate] },
    async () => {
      const [counts] = await app.db
        .select({
          total: sql<number>`count(*)::int`,
          dueNow: sql<number>`count(*) filter (where ${srsCards.dueAt} <= now())::int`,
          newCount: sql<number>`count(*) filter (where ${srsCards.state} = 'new')::int`,
          matureCount: sql<number>`count(*) filter (where ${srsCards.state} = 'mature')::int`,
        })
        .from(srsCards);

      return counts ?? { total: 0, dueNow: 0, newCount: 0, matureCount: 0 };
    },
  );

  // POST /api/srs/cards — créer une carte (utile pour tests + génération auto plus tard)
  a.post(
    "/srs/cards",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          skillId: z.string().uuid(),
          moduleId: z.string(),
          front: z.string().min(3),
          back: z.string().min(3),
          answerKeywords: z.array(z.string()).optional(),
        }),
      },
    },
    async ({ body }, reply) => {
      const [inserted] = await app.db
        .insert(srsCards)
        .values({
          skillId: body.skillId,
          moduleId: body.moduleId,
          front: body.front,
          back: body.back,
          answerKeywords: body.answerKeywords ?? null,
          state: "new",
        })
        .returning();

      return reply.code(201).send(inserted);
    },
  );

  // POST /api/srs/generate-for-skill — Claude génère 2-3 cartes pour un skill
  a.post(
    "/srs/generate-for-skill",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({ skillId: z.string().uuid() }),
      },
    },
    async ({ body }) => {
      return generateCardsForSkill(app.db, { skillId: body.skillId });
    },
  );

  // Re-export FSRS_RATING for client convenience
  app.log.debug({ ratings: FSRS_RATING }, "SRS routes mounted");
};

export default srsRoutes;
