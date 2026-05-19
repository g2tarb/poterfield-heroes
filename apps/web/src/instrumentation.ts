// Next.js instrumentation hook : routée par runtime.
// On délègue à sentry.server.config / sentry.edge.config s'ils initialisent.

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Capture les erreurs des Server Components / Route Handlers.
// Sentry.captureRequestError est un no-op tant que `init` n'a pas été appelé
// (i.e. tant que SENTRY_DSN n'est pas posée).
export const onRequestError = Sentry.captureRequestError;
