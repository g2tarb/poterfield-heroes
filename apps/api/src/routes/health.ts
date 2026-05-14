import type { FastifyPluginAsync } from "fastify";
import { sql } from "drizzle-orm";

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_req, reply) => {
    try {
      await app.db.execute(sql`select 1`);
      return reply.send({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: { database: "ok" },
      });
    } catch (err) {
      app.log.error({ err }, "Healthcheck failed: DB unreachable");
      return reply.code(503).send({
        status: "degraded",
        services: { database: "down" },
      });
    }
  });
};

export default healthRoutes;
