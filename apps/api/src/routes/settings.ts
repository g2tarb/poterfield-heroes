import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq, gte, sql } from "drizzle-orm";
import { userState, coachSessions, srsCards } from "@ph/db";

const settingsRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/settings
  a.get(
    "/settings",
    { preHandler: [app.authenticate] },
    async () => {
      const [user] = await app.db
        .select()
        .from(userState)
        .where(eq(userState.id, 1))
        .limit(1);

      // Budget IA mois en cours
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [budgetRow] = await app.db
        .select({
          totalCents: sql<number>`coalesce(sum(${coachSessions.totalCostCents}), 0)::int`,
          totalInputTokens: sql<number>`coalesce(sum(${coachSessions.totalInputTokens}), 0)::int`,
          totalOutputTokens: sql<number>`coalesce(sum(${coachSessions.totalOutputTokens}), 0)::int`,
          sessionsCount: sql<number>`count(*)::int`,
        })
        .from(coachSessions)
        .where(gte(coachSessions.startedAt, startOfMonth));

      const [srsCounts] = await app.db
        .select({
          total: sql<number>`count(*)::int`,
          mature: sql<number>`count(*) filter (where ${srsCards.state} = 'mature')::int`,
        })
        .from(srsCards);

      return {
        user: user
          ? {
              displayName: user.displayName,
              email: user.email,
              avatarUrl: user.avatarUrl,
              preferences: user.preferences,
            }
          : null,
        aiBudget: {
          monthlyLimitCents: 5000, // FUTURE: lire depuis env ou settings
          spentThisMonthCents: budgetRow?.totalCents ?? 0,
          inputTokens: budgetRow?.totalInputTokens ?? 0,
          outputTokens: budgetRow?.totalOutputTokens ?? 0,
          sessionsCount: budgetRow?.sessionsCount ?? 0,
        },
        srs: {
          total: srsCounts?.total ?? 0,
          mature: srsCounts?.mature ?? 0,
        },
      };
    },
  );

  // PATCH /api/settings — update preferences
  a.patch(
    "/settings",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          displayName: z.string().min(1).max(80).optional(),
          preferences: z
            .object({
              voiceTts: z.boolean().optional(),
              reducedMotion: z.boolean().optional(),
              dailySrsTarget: z.number().int().min(5).max(200).optional(),
              accentColor: z.string().optional(),
            })
            .optional(),
        }),
      },
    },
    async ({ body }) => {
      const [current] = await app.db
        .select({ preferences: userState.preferences })
        .from(userState)
        .where(eq(userState.id, 1))
        .limit(1);

      const merged = {
        ...(current?.preferences ?? {}),
        ...(body.preferences ?? {}),
      };

      await app.db
        .update(userState)
        .set({
          ...(body.displayName ? { displayName: body.displayName } : {}),
          ...(body.preferences ? { preferences: merged } : {}),
        })
        .where(eq(userState.id, 1));

      return { ok: true };
    },
  );

  // POST /api/settings/reset-progress — nuke la progression (garde le contenu)
  a.post(
    "/settings/reset-progress",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          confirm: z.literal("RESET").describe("Doit être exactement 'RESET'"),
        }),
      },
    },
    async (_req) => {
      // Supprimer tous les attempts, srs, notes, coach, etc. — garder modules/skills/videos
      const tablesToTruncate = [
        "exercise_attempts",
        "srs_reviews",
        "srs_cards",
        "video_progress",
        "skill_progress",
        "module_progress",
        "notebook_entries",
        "coach_messages",
        "coach_sessions",
        "memory_embeddings",
        "exam_submissions",
        "weekly_exams",
        "xp_events",
        "code_reviews",
        "github_pushes",
        "github_repos",
        "notifications",
      ];

      for (const table of tablesToTruncate) {
        await app.db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`));
      }

      // Reset user state (sans le supprimer)
      await app.db
        .update(userState)
        .set({
          currentXp: 0,
          streakDays: 0,
          longestStreak: 0,
          lastActiveAt: null,
          currentLevelId: 1,
        })
        .where(eq(userState.id, 1));

      return { ok: true, message: "Progress reset. Le contenu (modules, skills) est conservé." };
    },
  );
};

export default settingsRoutes;
