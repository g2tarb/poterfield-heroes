import fp from "fastify-plugin";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";
import { env } from "../config/env.js";

export default fp(
  async (app) => {
    app.setErrorHandler((error, request, reply) => {
      request.log.error({ err: error, url: request.url }, "request errored");

      if (error instanceof ZodError) {
        return reply.code(422).send({
          error: "ValidationError",
          message: "Invalid input",
          code: "VALIDATION_ERROR",
          details: error.flatten().fieldErrors,
        });
      }

      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      // Fastify validation
      if ((error as { validation?: unknown }).validation) {
        return reply.code(422).send({
          error: "ValidationError",
          message: error.message,
          code: "VALIDATION_ERROR",
        });
      }

      const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
      const isProd = env.NODE_ENV === "production";

      return reply.code(statusCode).send({
        error: "InternalServerError",
        message: isProd ? "Something went wrong." : error.message,
        ...(isProd ? {} : { stack: error.stack }),
      });
    });

    app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: "NotFoundError",
        message: `Route ${request.method} ${request.url} not found`,
        code: "ROUTE_NOT_FOUND",
      });
    });
  },
  { name: "error-handler" },
);
