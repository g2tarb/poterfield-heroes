"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SqlResultRow = Record<string, unknown>;

export type SqlResult = {
  id: string;
  durationMs: number;
  rows: SqlResultRow[];
  fields: { name: string; dataTypeID: number }[];
  affectedRows: number | undefined;
  sqlPreview: string;
};

type WorkerOut =
  | { type: "loading"; id: string; stage: string }
  | ({ type: "result" } & SqlResult)
  | { type: "error"; id: string; message: string };

export function usePgliteRunner() {
  const workerRef = useRef<Worker | null>(null);
  const [running, setRunning] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [result, setResult] = useState<SqlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runIdRef = useRef<string | null>(null);

  const ensureWorker = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (workerRef.current) return workerRef.current;

    const w = new Worker(new URL("./pglite.worker.ts", import.meta.url), {
      type: "module",
    });
    w.onmessage = (event: MessageEvent<WorkerOut>) => {
      const data = event.data;
      if (data.id !== runIdRef.current) return;
      if (data.type === "loading") {
        setLoadingStage(data.stage);
      } else if (data.type === "result") {
        setResult(data);
        setRunning(false);
        setLoadingStage(null);
      } else if (data.type === "error") {
        setError(data.message);
        setRunning(false);
        setLoadingStage(null);
      }
    };
    workerRef.current = w;
    return w;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback(
    (sql: string) => {
      if (running) return;
      setError(null);
      setResult(null);
      const w = ensureWorker();
      if (!w) return;
      const id = `sql-${Date.now()}`;
      runIdRef.current = id;
      setRunning(true);
      w.postMessage({ id, sql });
    },
    [running, ensureWorker],
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { run, clear, result, error, running, loadingStage };
}
