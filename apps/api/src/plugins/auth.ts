import fp from "fastify-plugin";
import cookie from "@fastify/cookie";
import { timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

const COOKIE_NAME = "ph_session";
const SESSION_VALUE = "authenticated"; // mono-user, le contenu importe peu, c'est la signature qui protège
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      req: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply,
    ) => Promise<void>;
  }
  interface FastifyRequest {
    isAuthenticated: boolean;
  }
}

function safeCompare(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export default fp(
  async (app) => {
    await app.register(cookie, {
      secret: env.SESSION_SECRET,
      parseOptions: { signed: true },
    });

    // Decorate every request with isAuthenticated (auto-set by hook)
    app.decorateRequest("isAuthenticated", false);
    app.addHook("preHandler", async (req) => {
      const raw = req.cookies[COOKIE_NAME];
      if (!raw) return;
      const unsigned = req.unsignCookie(raw);
      req.isAuthenticated =
        unsigned.valid === true && unsigned.value === SESSION_VALUE;
    });

    // Decorator : middleware to protect routes
    app.decorate(
      "authenticate",
      async (req: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => {
        if (!req.isAuthenticated) {
          return reply.code(401).send({
            error: "UnauthorizedError",
            message: "Authentication required",
            code: "UNAUTHORIZED",
          });
        }
      },
    );

    // === Routes ===
    // Rate limit strict sur login : 5 tentatives / 5 min / IP. Au-delà, 429.
    app.post<{ Body: { password: string } }>(
      "/api/auth/login",
      {
        config: {
          rateLimit: {
            max: 5,
            timeWindow: "5 minutes",
          },
        },
      },
      async (req, reply) => {
      const { password } = (req.body ?? {}) as { password?: string };
      if (typeof password !== "string" || password.length < 1) {
        return reply.code(400).send({
          error: "ValidationError",
          message: "Password required",
        });
      }

      if (!safeCompare(password, env.ACCESS_PASSWORD)) {
        // Petit délai constant pour limiter timing attacks supplémentaires
        await new Promise((r) => setTimeout(r, 250));
        return reply.code(401).send({
          error: "UnauthorizedError",
          message: "Invalid password",
        });
      }

      // Cross-subdomain en prod (web sur poterfield.online, API sur api.poterfield.online) :
      // SameSite=None + Secure est requis pour que le browser envoie le cookie cross-site.
      const isProd = env.NODE_ENV === "production";
      reply.setCookie(COOKIE_NAME, SESSION_VALUE, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        signed: true,
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
      });

      return reply.send({ ok: true });
    });

    app.post("/api/auth/logout", async (req, reply) => {
      reply.clearCookie(COOKIE_NAME, { path: "/" });
      return reply.send({ ok: true });
    });

    app.get("/api/auth/me", async (req) => {
      return { authenticated: req.isAuthenticated };
    });
  },
  { name: "auth" },
);
