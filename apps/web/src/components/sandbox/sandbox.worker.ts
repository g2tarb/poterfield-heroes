/// <reference lib="webworker" />

// Web Worker isolé pour exécuter du code utilisateur.
// Scope: pas de DOM, accès limité aux APIs Worker (fetch, setTimeout, console, Math, etc.).

type LogKind = "log" | "info" | "warn" | "error";

type IncomingMessage = {
  id: string;
  code: string;
  language: "javascript" | "typescript";
};

type OutgoingMessage =
  | { type: "log"; id: string; kind: LogKind; args: string[] }
  | { type: "done"; id: string; durationMs: number; result?: string }
  | { type: "error"; id: string; message: string; stack?: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

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

ctx.onmessage = async (event: MessageEvent<IncomingMessage>) => {
  const { id, code } = event.data;
  const start = performance.now();

  // Intercept console
  const sendLog = (kind: LogKind, args: unknown[]) => {
    const msg: OutgoingMessage = {
      type: "log",
      id,
      kind,
      args: args.map(serialize),
    };
    ctx.postMessage(msg);
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
    const msg: OutgoingMessage = {
      type: "done",
      id,
      durationMs,
      ...(result !== undefined ? { result: serialize(result) } : {}),
    };
    ctx.postMessage(msg);
  } catch (err) {
    const e = err as Error;
    const msg: OutgoingMessage = {
      type: "error",
      id,
      message: e.message || String(err),
      ...(e.stack ? { stack: e.stack } : {}),
    };
    ctx.postMessage(msg);
  }
};
