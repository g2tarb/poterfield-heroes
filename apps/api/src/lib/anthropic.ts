import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

if (!env.ANTHROPIC_API_KEY) {
  console.warn("[anthropic] ANTHROPIC_API_KEY not set — coach disabled.");
}

export const anthropic = env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  : null;

// === Models 2026 ===
export const MODEL_HAIKU = "claude-haiku-4-5";   // questions simples, hints rapides
export const MODEL_SONNET = "claude-sonnet-4-6"; // par défaut, review code, exemples
export const MODEL_OPUS = "claude-opus-4-7";     // raisonnement complexe seulement

// === Prix par M tokens (cents, jan 2026) ===
// Pour estimation coût ; mettre à jour si Anthropic change la grille.
export const PRICING_CENTS_PER_M_TOKENS = {
  [MODEL_HAIKU]: { input: 100, output: 500, cacheWrite: 125, cacheRead: 10 },
  [MODEL_SONNET]: { input: 300, output: 1500, cacheWrite: 375, cacheRead: 30 },
  [MODEL_OPUS]: { input: 1500, output: 7500, cacheWrite: 1875, cacheRead: 150 },
} as const;

export type ModelId =
  | typeof MODEL_HAIKU
  | typeof MODEL_SONNET
  | typeof MODEL_OPUS;

export function computeCostCents(
  model: ModelId,
  inputTokens: number,
  outputTokens: number,
  cachedReadTokens: number,
  cachedWriteTokens: number,
): number {
  const p = PRICING_CENTS_PER_M_TOKENS[model];
  const million = 1_000_000;
  return Math.round(
    (inputTokens * p.input +
      outputTokens * p.output +
      cachedReadTokens * p.cacheRead +
      cachedWriteTokens * p.cacheWrite) /
      million,
  );
}

/**
 * Safely extract cache token counts from Anthropic Usage.
 * The SDK type does not always expose these fields yet (depends on version),
 * but they are present in the response when prompt caching is enabled.
 */
export function extractCacheTokens(usage: unknown): {
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
} {
  const u = usage as {
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
  return {
    cacheReadInputTokens: u?.cache_read_input_tokens ?? 0,
    cacheCreationInputTokens: u?.cache_creation_input_tokens ?? 0,
  };
}
