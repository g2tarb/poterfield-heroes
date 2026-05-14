import fp from "fastify-plugin";
import { createDb, type Database } from "@ph/db";
import { env } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
  }
}

export default fp(
  async (app) => {
    const db = createDb(env.DATABASE_URL);
    app.decorate("db", db);

    app.addHook("onClose", async () => {
      app.log.info("Closing database connections…");
      // postgres-js client auto-cleanup on process exit, no explicit close API exposed
    });
  },
  { name: "db" },
);
