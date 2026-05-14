import { env } from "../config/env.js";

const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

// Pour Porterfield Heroes : voyage-3-large (1024d) — multilingue FR/EN bon pour code+texte.
// Alternative : voyage-code-3 si on indexe surtout du code (1024d aussi).
export const VOYAGE_MODEL = "voyage-3-large" as const;
export const VOYAGE_DIM = 1024 as const;

export type VoyageInputType = "document" | "query";

type VoyageResponse = {
  object: "list";
  data: Array<{ object: "embedding"; embedding: number[]; index: number }>;
  model: string;
  usage: { total_tokens: number };
};

export async function voyageEmbed(
  texts: string[],
  inputType: VoyageInputType,
): Promise<{ embeddings: number[][]; totalTokens: number }> {
  if (!env.VOYAGE_API_KEY) {
    throw new Error("VOYAGE_API_KEY not configured");
  }
  if (texts.length === 0) return { embeddings: [], totalTokens: 0 };

  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Voyage API ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as VoyageResponse;
  const embeddings = data.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
  return { embeddings, totalTokens: data.usage.total_tokens };
}

export async function voyageEmbedSingle(
  text: string,
  inputType: VoyageInputType,
): Promise<number[]> {
  const { embeddings } = await voyageEmbed([text], inputType);
  if (!embeddings[0]) throw new Error("Empty embedding returned");
  return embeddings[0];
}
