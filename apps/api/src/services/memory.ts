import type { Database } from "@ph/db";
import { memoryEmbeddings } from "@ph/db";
import { and, eq, sql } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { voyageEmbed, voyageEmbedSingle } from "../lib/voyage.js";

type MemorySource =
  | "error"
  | "note"
  | "exercise"
  | "exam"
  | "code_push"
  | "summary";

export async function indexMemory(
  db: Database,
  args: {
    source: MemorySource;
    sourceId?: string;
    moduleId?: string | null;
    exerciseId?: string | null;
    content: string;
    contentSummary?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<{ id: string } | null> {
  if (!args.content.trim()) return null;

  try {
    const embedding = await voyageEmbedSingle(args.content, "document");

    const [inserted] = await db
      .insert(memoryEmbeddings)
      .values({
        source: args.source,
        sourceId: args.sourceId ?? null,
        moduleId: args.moduleId ?? null,
        exerciseId: args.exerciseId ?? null,
        content: args.content,
        contentSummary: args.contentSummary ?? null,
        metadata: args.metadata ?? null,
        embedding,
      })
      .returning({ id: memoryEmbeddings.id });

    return inserted ?? null;
  } catch (err) {
    // RAG indexation must never break the parent flow.
    console.error("[memory.indexMemory] failed", err);
    return null;
  }
}

export async function reindexMemory(
  db: Database,
  memoryId: string,
  content: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const embedding = await voyageEmbedSingle(content, "document");
    await db
      .update(memoryEmbeddings)
      .set({
        content,
        embedding,
        ...(metadata ? { metadata } : {}),
      })
      .where(eq(memoryEmbeddings.id, memoryId));
  } catch (err) {
    console.error("[memory.reindexMemory] failed", err);
  }
}

export type RetrievedMemory = {
  id: string;
  source: MemorySource;
  content: string;
  contentSummary: string | null;
  moduleId: string | null;
  distance: number;
};

/**
 * Retrieve top-K memories most similar to a query.
 * Uses pgvector cosine distance. Filters by moduleId if provided.
 */
export async function retrieveRelevant(
  db: Database,
  args: {
    query: string;
    moduleId?: string | null;
    limit?: number;
    maxDistance?: number; // 0..2, cosine distance ; smaller = closer
  },
): Promise<RetrievedMemory[]> {
  if (!args.query.trim()) return [];

  const limit = args.limit ?? 5;
  const maxDistance = args.maxDistance ?? 0.7;

  try {
    const queryEmbedding = await voyageEmbedSingle(args.query, "query");
    const distanceExpr = cosineDistance(memoryEmbeddings.embedding, queryEmbedding);

    const whereClauses = [sql`${distanceExpr} < ${maxDistance}`];
    if (args.moduleId) {
      whereClauses.push(eq(memoryEmbeddings.moduleId, args.moduleId));
    }

    const rows = await db
      .select({
        id: memoryEmbeddings.id,
        source: memoryEmbeddings.source,
        content: memoryEmbeddings.content,
        contentSummary: memoryEmbeddings.contentSummary,
        moduleId: memoryEmbeddings.moduleId,
        distance: sql<number>`${distanceExpr}`.as("distance"),
      })
      .from(memoryEmbeddings)
      .where(and(...whereClauses))
      .orderBy(distanceExpr)
      .limit(limit);

    return rows as RetrievedMemory[];
  } catch (err) {
    console.error("[memory.retrieveRelevant] failed", err);
    return [];
  }
}
