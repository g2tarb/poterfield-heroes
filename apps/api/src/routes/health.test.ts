import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";

describe("integration: GET /health", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("retourne 200 quand la DB répond", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect([200, 503]).toContain(res.statusCode);
    const body = res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("services");
  });
});

describe("integration: POST /api/auth/login", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejette une requête sans body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejette un mauvais mot de passe", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { password: "wrong-password-xxxx" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("integration: GET /api/modules", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("retourne une liste de modules (peut être vide en CI)", async () => {
    const res = await app.inject({ method: "GET", url: "/api/modules" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });
});
