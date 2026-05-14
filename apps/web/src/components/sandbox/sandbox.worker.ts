/// <reference lib="webworker" />

// Web Worker isolé pour exécuter du code utilisateur.
// Scope: pas de DOM, accès limité aux APIs Worker (fetch, setTimeout, console, Math, etc.).

type LogKind = "log" | "info" | "warn" | "error";

type WorkerIncoming = {
  id: string;
  code: string;
  language: "javascript" | "typescript";
};

type WorkerOutgoing =
  | { type: "log"; id: string; kind: LogKind; args: string[] }
  | { type: "done"; id: string; durationMs: number; result?: string }
  | { type: "error"; id: string; message: string; stack?: string };

const sbCtx = self as unknown as DedicatedWorkerGlobalScope;

function serialize(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "function") return value.toString();
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

sbCtx.onmessage = async (event: MessageEvent<WorkerIncoming>) => {
  const { id, code } = event.data;
  const start = performance.now();

  // Intercept console
  const sendLog = (kind: LogKind, args: unknown[]) => {
    const msg: WorkerOutgoing = {
      type: "log",
      id,
      kind,
      args: args.map(serialize),
    };
    sbCtx.postMessage(msg);
  };

  const customConsole = {
    log: (...a: unknown[]) => sendLog("log", a),
    info: (...a: unknown[]) => sendLog("info", a),
    warn: (...a: unknown[]) => sendLog("warn", a),
    error: (...a: unknown[]) => sendLog("error", a),
  };

  try {
    // We strip TS-only syntax in a very naive way for V0: type annotations like : string get past Function constructor by being valid runtime patterns sometimes. For real TS support we'll plug a tiny stripper later.
    const fn = new Function(
      "console",
      `"use strict";\nreturn (async () => {\n${code}\n})();`,
    );
    const result = await fn(customConsole);
    const durationMs = Math.round(performance.now() - start);
    const msg: WorkerOutgoing = {
      type: "done",
      id,
      durationMs,
      ...(result !== undefined ? { result: serialize(result) } : {}),
    };
    sbCtx.postMessage(msg);
  } catch (err) {
    const e = err as Error;
    const msg: WorkerOutgoing = {
      type: "error",
      id,
      message: e.message || String(err),
      ...(e.stack ? { stack: e.stack } : {}),
    };
    sbCtx.postMessage(msg);
  }
};
