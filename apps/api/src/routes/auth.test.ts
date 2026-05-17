import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";
import { env } from "../config/env.js";

describe("integration: auth flow complet", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("login avec mot de passe valide → 200 + cookie signé", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { password: env.ACCESS_PASSWORD },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    // Cookie ph_session signé : doit contenir le nom
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(",") : setCookie!;
    expect(cookieStr).toContain("ph_session=");
    expect(cookieStr).toContain("HttpOnly");
    expect(cookieStr.toLowerCase()).toContain("samesite=lax");
  });

  it("login sans password → 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });

  it("login avec password vide → 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { password: "" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("route protégée sans cookie → 401", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/progress/state",
    });
    expect(res.statusCode).toBe(401);
  });

  it("route protégée avec cookie valide → 200", async () => {
    // 1. Login pour obtenir le cookie
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { password: env.ACCESS_PASSWORD },
    });
    const setCookie = login.headers["set-cookie"];
    const cookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie!;

    // 2. Réutiliser le cookie pour une route protégée
    const res = await app.inject({
      method: "GET",
      url: "/api/progress/state",
      headers: { cookie: cookieHeader },
    });
    // 200 si user_state existe, sinon 404. Le test est OK si pas 401.
    expect(res.statusCode).not.toBe(401);
  });

  it("logout efface le cookie", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/logout",
    });
    expect(res.statusCode).toBe(200);
    const setCookie = res.headers["set-cookie"];
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(",") : setCookie!;
    // clearCookie set un cookie avec Expires dans le passé
    expect(cookieStr).toContain("ph_session=");
    expect(cookieStr.toLowerCase()).toMatch(/expires=|max-age=0/);
  });

  it("/api/auth/me sans cookie → authenticated: false", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/auth/me",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ authenticated: false });
  });

  it("/api/auth/me avec cookie valide → authenticated: true", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { password: env.ACCESS_PASSWORD },
    });
    const setCookie = login.headers["set-cookie"];
    const cookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie!;

    const res = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: { cookie: cookieHeader },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ authenticated: true });
  });

  it("login avec cookie forgé (non signé) → ignoré, route reste 401", async () => {
    const forged = "ph_session=authenticated";
    const res = await app.inject({
      method: "GET",
      url: "/api/progress/state",
      headers: { cookie: forged },
    });
    expect(res.statusCode).toBe(401);
  });
});
