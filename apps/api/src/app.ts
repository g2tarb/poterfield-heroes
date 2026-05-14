import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import authPlugin from "./plugins/auth.js";
import dbPlugin from "./plugins/db.js";
import errorHandlerPlugin from "./plugins/error-handler.js";
import coachRoutes from "./routes/coach.js";
import examsRoutes from "./routes/exams.js";
import githubRoutes from "./routes/github.js";
import healthRoutes from "./routes/health.js";
import modulesRoutes from "./routes/modules.js";
import notebookRoutes from "./routes/notebook.js";
import progressRoutes from "./routes/progress.js";
import publicRoutes from "./routes/public.js";
import pushRoutes from "./routes/push.js";
import srsRoutes from "./routes/srs.js";
import videoRoutes from "./routes/video.js";
import { env } from "./config/env.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      ...(env.NODE_ENV === "development"
        ? { transport: { target: "pino-pretty", options: { colorize: true } } }
        : {}),
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.body.password",
          "*.password",
          "*.token",
          "*.apiKey",
        ],
        censor: "[REDACTED]",
      },
    },
    trustProxy: true,
    disableRequestLogging: false,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(errorHandlerPlugin);
  await app.register(sensible);
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  });
  await app.register(helmet, {
    contentSecurityPolicy: false, // CSP géré côté Next.js
  });
  await app.register(dbPlugin);
  await app.register(authPlugin, { prefix: "/api" });

  await app.register(healthRoutes);
  await app.register(modulesRoutes, { prefix: "/api" });
  await app.register(coachRoutes, { prefix: "/api" });
  await app.register(srsRoutes, { prefix: "/api" });
  await app.register(notebookRoutes, { prefix: "/api" });
  await app.register(progressRoutes, { prefix: "/api" });
  await app.register(examsRoutes, { prefix: "/api" });
  await app.register(publicRoutes, { prefix: "/api" });
  await app.register(githubRoutes, { prefix: "/api" });
  await app.register(pushRoutes, { prefix: "/api" });
  await app.register(videoRoutes, { prefix: "/api" });

  return app;
}
