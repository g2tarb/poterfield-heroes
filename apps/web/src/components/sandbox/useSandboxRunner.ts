"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type LogEntry = {
  id: string;
  kind: "log" | "info" | "warn" | "error" | "result" | "system";
  text: string;
  ts: number;
};

type WorkerOutMessage =
  | { type: "log"; id: string; kind: LogEntry["kind"]; args: string[] }
  | { type: "done"; id: string; durationMs: number; result?: string }
  | { type: "error"; id: string; message: string; stack?: string };

const DEFAULT_TIMEOUT_MS = 5000;

export function useSandboxRunner() {
  const workerRef = useRef<Worker | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef<string | null>(null);

  const initWorker = useCallback(() => {
    if (typeof window === "undefined") return null;
    const w = new Worker(new URL("./sandbox.worker.ts", import.meta.url), {
      type: "module",
    });
    w.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const data = event.data;
      if (data.id !== runIdRef.current) return;

      if (data.type === "log") {
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
      }
    };
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
    (code: string, language: "javascript" | "typescript" = "javascript") => {
      if (running) return;
      // Reset previous run
      setLogs([]);
      setDurationMs(null);

      // Recreate worker each run for total isolation
      workerRef.current?.terminate();
      workerRef.current = initWorker();
      if (!workerRef.current) return;

      const id = `run-${Date.now()}`;
      runIdRef.current = id;
      setRunning(true);

      timeoutRef.current = setTimeout(() => {
        if (runIdRef.current !== id) return;
        workerRef.current?.terminate();
        workerRef.current = null;
        setLogs((prev) => [
          ...prev,
          {
            id: `${id}-timeout`,
            kind: "error",
            text: `Timeout après ${DEFAULT_TIMEOUT_MS}ms — boucle infinie ?`,
            ts: Date.now(),
          },
        ]);
        setRunning(false);
      }, DEFAULT_TIMEOUT_MS);

      workerRef.current.postMessage({ id, code, language });
    },
    [running, initWorker],
  );

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    workerRef.current?.terminate();
    workerRef.current = null;
    setRunning(false);
    setLogs((prev) => [
      ...prev,
      {
        id: `stop-${Date.now()}`,
        kind: "system",
        text: "Stoppé par l'utilisateur.",
        ts: Date.now(),
      },
    ]);
  }, []);

  const clear = useCallback(() => {
    setLogs([]);
    setDurationMs(null);
  }, []);

  return { run, stop, clear, logs, running, durationMs };
}
