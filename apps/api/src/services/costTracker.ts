import type { Database } from "@ph/db";
import { aiCosts, coachSessions } from "@ph/db";
import { gte, sql } from "drizzle-orm";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import {
  computeCostCents,
  extractCacheTokens,
  type ModelId,
} from "../lib/anthropic.js";

export type AiCostCategory =
  | "coach"
  | "exercise_correction"
  | "skill_question"
  | "skill_validation"
  | "exam_generation"
  | "github_review"
  | "srs_generation"
  | "code_noir"
  | "code_noir_eli5"
  | "code_noir_quiz"
  | "memory_embedding";

// Persiste le coût d'un appel Claude après que la réponse soit reçue.
export async function trackAiCost(
  db: Database,
  input: {
    category: AiCostCategory;
    model: ModelId;
    usage: unknown;
    sourceRef?: string | null;
  },
): Promise<{ costCents: number }> {
  // Anthropic usage est dans response.usage (input_tokens, output_tokens, cache_*).
  const u = input.usage as {
    input_tokens?: number;
    output_tokens?: number;
  };
  const cache = extractCacheTokens(input.usage);
  const inputTokens = u?.input_tokens ?? 0;
  const outputTokens = u?.output_tokens ?? 0;
  const costCents = computeCostCents(
    input.model,
    inputTokens,
    outputTokens,
    cache.cacheReadInputTokens,
    cache.cacheCreationInputTokens,
  );

  await db.insert(aiCosts).values({
    category: input.category,
    model: input.model,
    inputTokens,
    outputTokens,
    cacheReadTokens: cache.cacheReadInputTokens,
    cacheWriteTokens: cache.cacheCreationInputTokens,
    costCents,
    sourceRef: input.sourceRef ?? null,
  });

  return { costCents };
}

// Renvoie le total dépensé ce mois (coach + ai_costs).
export async function getSpentThisMonthCents(db: Database): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [coachRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${coachSessions.totalCostCents}), 0)::int`,
    })
    .from(coachSessions)
    .where(gte(coachSessions.startedAt, startOfMonth));

  const [aiRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${aiCosts.costCents}), 0)::int`,
    })
    .from(aiCosts)
    .where(gte(aiCosts.createdAt, startOfMonth));

  return (coachRow?.total ?? 0) + (aiRow?.total ?? 0);
}

// Vérifie qu'on n'a pas dépassé le budget mensuel. À appeler AVANT chaque call Claude
// dont le coût n'est pas négligeable. Throws AppError 429 si dépassé.
export async function assertBudget(db: Database): Promise<void> {
  const limit = env.MONTHLY_AI_BUDGET_CENTS;
  if (!limit || limit <= 0) return; // pas de limite configurée → skip

  const spent = await getSpentThisMonthCents(db);
  if (spent >= limit) {
    throw new AppError(
      429,
      `Budget IA mensuel dépassé (${spent}¢ / ${limit}¢). Revient le mois prochain ou ajuste MONTHLY_AI_BUDGET_CENTS.`,
    );
  }
}

// Stats pour /api/settings et /api/stats/ai
export type AiSpendStats = {
  spentThisMonthCents: number;
  limitCents: number;
  remainingCents: number;
  byCategory: Array<{ category: string; costCents: number; calls: number }>;
};

export async function getAiSpendStats(db: Database): Promise<AiSpendStats> {
  const limitCents = env.MONTHLY_AI_BUDGET_CENTS ?? 0;
  const spent = await getSpentThisMonthCents(db);

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const rows = await db
    .select({
      category: aiCosts.category,
      costCents: sql<number>`sum(${aiCosts.costCents})::int`,
      calls: sql<number>`count(*)::int`,
    })
    .from(aiCosts)
    .where(gte(aiCosts.createdAt, startOfMonth))
    .groupBy(aiCosts.category);

  return {
    spentThisMonthCents: spent,
    limitCents,
    remainingCents: Math.max(0, limitCents - spent),
    byCategory: rows,
  };
}
