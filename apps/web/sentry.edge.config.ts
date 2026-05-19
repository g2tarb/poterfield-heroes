// Sentry — runtime Edge (middleware, route handlers en edge runtime).
// Init seulement si SENTRY_DSN est posée. Sinon dormant.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  });
}
