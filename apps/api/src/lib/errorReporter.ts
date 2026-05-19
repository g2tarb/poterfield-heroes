// Centralisation des erreurs serveur.
// - Log structuré via Pino (logger Fastify) toujours actif
// - Si SENTRY_DSN est posée dans l'env, branche `@sentry/node` (lazy-import)
//   et envoie aussi les exceptions à Sentry.

import type { FastifyBaseLogger } from "fastify";
import { env } from "../config/env";

type SentryLike = {
  init: (opts: Record<string, unknown>) => void;
  captureException: (err: unknown, hint?: { extra?: Record<string, unknown> }) => string;
};

let baseLogger: FastifyBaseLogger | null = null;
let sentry: SentryLike | null = null;

export async function initErrorReporter(logger: FastifyBaseLogger) {
  baseLogger = logger;

  process.on("unhandledRejection", (reason) => {
    captureError(reason, { source: "unhandledRejection" });
  });

  process.on("uncaughtException", (err) => {
    captureError(err, { source: "uncaughtException" });
  });

  if (env.SENTRY_DSN) {
    try {
      const mod = (await import("@sentry/node")) as unknown as SentryLike;
      mod.init({
        dsn: env.SENTRY_DSN,
        tracesSampleRate: 0.1,
        environment: env.NODE_ENV,
      });
      sentry = mod;
      logger.info("Sentry initialised (api)");
    } catch (err) {
      logger.warn({ err }, "Sentry init failed, continuing without it");
    }
  }
}

export function captureError(
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  const log = baseLogger ?? console;
  const payload =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { value: String(error) };

  if ("error" in log && typeof log.error === "function") {
    log.error({ err: payload, ...context }, "captured error");
  } else {
    console.error("[porterfield] captured error", payload, context);
  }

  if (sentry) {
    try {
      sentry.captureException(error, { extra: context });
    } catch {
      // best-effort, ne jamais throw depuis le reporter
    }
  }
}
