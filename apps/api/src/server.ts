import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { maybeGenerateThisWeekExam } from "./services/examGenerator.js";
import { maybeSendSrsReminder } from "./services/push.js";

const app = await buildApp();

// Weekly exam cron tick (every hour, idempotent)
const examInterval = setInterval(
  () => {
    void maybeGenerateThisWeekExam(app.db).catch((err) =>
      app.log.error({ err }, "exam cron tick failed"),
    );
  },
  60 * 60 * 1000,
);

// SRS reminder cron tick (every hour, fires once between 8h-10h if due cards)
const srsReminderInterval = setInterval(
  () => {
    void maybeSendSrsReminder(app.db).catch((err) =>
      app.log.error({ err }, "srs reminder tick failed"),
    );
  },
  60 * 60 * 1000,
);

const signals = ["SIGINT", "SIGTERM"] as const;
for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info({ signal }, "Shutting down gracefully…");
    try {
      clearInterval(examInterval);
      clearInterval(srsReminderInterval);
      await app.close();
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, "Failed to close gracefully");
      process.exit(1);
    }
  });
}

try {
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
} catch (err) {
  app.log.error({ err }, "Failed to start server");
  process.exit(1);
}
