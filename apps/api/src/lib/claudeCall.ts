import type { Database } from "@ph/db";
import { anthropic, type ModelId } from "./anthropic.js";
import { AppError } from "./errors.js";
import {
  assertBudget,
  trackAiCost,
  type AiCostCategory,
} from "../services/costTracker.js";

type AnthropicMessageParam = {
  role: "user" | "assistant";
  content: string;
};

type ClaudeCallOptions = {
  db: Database;
  category: AiCostCategory;
  model: ModelId;
  system?: string;
  messages: AnthropicMessageParam[];
  maxTokens?: number;
  sourceRef?: string | null;
  enforceBudget?: boolean; // default true
};

/**
 * Wrapper centralisé pour TOUS les appels Claude.
 * - Vérifie le budget mensuel AVANT (throw 429 si dépassé)
 * - Persiste le coût APRÈS (table ai_costs)
 * - Retourne le texte + le costCents calculé
 */
export async function callClaude(opts: ClaudeCallOptions): Promise<{
  text: string;
  costCents: number;
}> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing");
  }

  if (opts.enforceBudget !== false) {
    await assertBudget(opts.db);
  }

  const response = await anthropic.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 1024,
    ...(opts.system ? { system: opts.system } : {}),
    messages: opts.messages,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AppError(502, "Claude returned no text");
  }

  const { costCents } = await trackAiCost(opts.db, {
    category: opts.category,
    model: opts.model,
    usage: response.usage,
    sourceRef: opts.sourceRef ?? null,
  });

  return { text: textBlock.text, costCents };
}
