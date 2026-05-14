"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LogEntry } from "./useSandboxRunner";

type WorkerOutMessage =
  | { type: "log"; id: string; kind: LogEntry["kind"]; args: string[] }
  | { type: "loading"; id: string; stage: string }
  | { type: "done"; id: string; durationMs: number; result?: string }
  | { type: "error"; id: string; message: string; stack?: string };

const TIMEOUT_MS = 30_000; // Python est plus lent, on est tolérant

export function usePyodideRunner() {
  const workerRef = useRef<Worker | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef<string | null>(null);

  const ensureWorker = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (workerRef.current) return workerRef.current;

    const w = new Worker(new URL("./pyodide.worker.ts", import.meta.url), {
      type: "module",
    });

    w.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const data = event.data;
      if (data.id !== runIdRef.current) return;

      if (data.type === "loading") {
        setLoadingStage(data.stage);
        setLogs((prev) => [
          ...prev,
          {
            id: `${data.id}-load-${prev.length}`,
            kind: "system",
            text: data.stage,
            ts: Date.now(),
          },
        ]);
      } else if (data.type === "log") {
        setLogs((prev) => [
          ...prev,
          {
            id: `${data.id}-${prev.length}`,
            kind: data.kind,
            text: data.args.join(" "),
            ts: Date.now(),
          },
        ]);
      } else if (data.type === "done") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDurationMs(data.durationMs);
        if (data.result !== undefined) {
          setLogs((prev) => [
            ...prev,
            {
              id: `${data.id}-result`,
              kind: "result",
              text: `→ ${data.result}`,
              ts: Date.now(),
            },
          ]);
        }
        setRunning(false);
        setLoadingStage(null);
      } else if (data.type === "error") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setLogs((prev) => [
          ...prev,
          {
            id: `${data.id}-err`,
            kind: "error",
            text: data.message + (data.stack ? `\n${data.stack}` : ""),
            ts: Date.now(),
          },
        ]);
        setRunning(false);
        setLoadingStage(null);
      }
    };

    workerRef.current = w;
    return w;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback(
    (code: string) => {
      if (running) return;
      setLogs([]);
      setDurationMs(null);

      const w = ensureWorker();
      if (!w) return;

      const id = `pyrun-${Date.now()}`;
      runIdRef.current = id;
      setRunning(true);

      timeoutRef.current = setTimeout(() => {
        if (runIdRef.current !== id) return;
        w.terminate();
        workerRef.current = null;
        setLogs((prev) => [
          ...prev,
          {
            id: `${id}-timeout`,
            kind: "error",
            text: `Timeout après ${TIMEOUT_MS}ms`,
            ts: Date.now(),
          },
        ]);
        setRunning(false);
      }, TIMEOUT_MS);

      w.postMessage({ id, code });
    },
    [running, ensureWorker],
  );

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    workerRef.current?.terminate();
    workerRef.current = null;
    setRunning(false);
    setLoadingStage(null);
    setLogs((prev) => [
      ...prev,
      {
        id: `stop-${Date.now()}`,
        kind: "system",
        text: "Stoppé.",
        ts: Date.now(),
      },
    ]);
  }, []);

  const clear = useCallback(() => {
    setLogs([]);
    setDurationMs(null);
  }, []);

  return { run, stop, clear, logs, running, durationMs, loadingStage };
}
