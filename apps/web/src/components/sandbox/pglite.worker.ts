/// <reference lib="webworker" />

// PGlite worker — Postgres in-browser via WASM (~3 MB).
// Persiste en mémoire pour la session (pas IndexedDB en V0).

import { PGlite } from "@electric-sql/pglite";

type IncomingMessage = { id: string; sql: string };

type Row = Record<string, unknown>;
type Field = { name: string; dataTypeID: number };

type OutgoingMessage =
  | { type: "loading"; id: string; stage: string }
  | {
      type: "result";
      id: string;
      durationMs: number;
      rows: Row[];
      fields: Field[];
      affectedRows: number | undefined;
      sqlPreview: string;
    }
  | { type: "error"; id: string; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

let dbPromise: Promise<PGlite> | null = null;

function getDb(id: string): Promise<PGlite> {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    ctx.postMessage({
      type: "loading",
      id,
      stage: "Initialisation Postgres WASM…",
    } satisfies OutgoingMessage);
    const db = new PGlite();
    await db.waitReady;
    ctx.postMessage({
      type: "loading",
      id,
      stage: "Postgres prêt.",
    } satisfies OutgoingMessage);
    return db;
  })();
  return dbPromise;
}

ctx.onmessage = async (event: MessageEvent<IncomingMessage>) => {
  const { id, sql } = event.data;
  const start = performance.now();

  try {
    const db = await getDb(id);

    // exec() pour multi-statements, query() pour un seul. On utilise exec() pour flexibilité.
    const results = await db.exec(sql);
    const durationMs = Math.round(performance.now() - start);

    // exec retourne un tableau de Results. On envoie le dernier (= dernier statement)
    const lastResult = results[results.length - 1];

    const msg: OutgoingMessage = {
      type: "result",
      id,
      durationMs,
      rows: (lastResult?.rows as Row[]) ?? [],
      fields: (lastResult?.fields as Field[]) ?? [],
      affectedRows: lastResult?.affectedRows ?? undefined,
      sqlPreview: sql.trim().slice(0, 120),
    };
    ctx.postMessage(msg);
  } catch (err) {
    const e = err as Error;
    ctx.postMessage({
      type: "error",
      id,
      message: e.message || String(err),
    } satisfies OutgoingMessage);
  }
};
