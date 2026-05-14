import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { verify } from "@octokit/webhooks-methods";
import { githubPushes, codeReviews, githubRepos } from "@ph/db";
import { env } from "../config/env.js";
import { processPush, type GithubPushPayload } from "../services/githubReview.js";

const githubRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // POST /api/github/webhook — endpoint webhook GitHub (pas d'auth user, signature HMAC)
  // Configure dans GitHub App : URL = https://yourdomain/api/github/webhook, secret = GITHUB_WEBHOOK_SECRET
  app.post<{ Body: GithubPushPayload }>("/github/webhook", async (req, reply) => {
    const signature = req.headers["x-hub-signature-256"];
    const eventType = req.headers["x-github-event"];

    if (typeof signature !== "string") {
      return reply.code(401).send({ error: "Missing signature" });
    }
    if (!env.GITHUB_WEBHOOK_SECRET) {
      return reply.code(503).send({ error: "Webhook not configured" });
    }

    const rawBody = JSON.stringify(req.body);
    const valid = await verify(env.GITHUB_WEBHOOK_SECRET, rawBody, signature);
    if (!valid) {
      return reply.code(401).send({ error: "Invalid signature" });
    }

    if (eventType !== "push") {
      return reply.code(200).send({ ignored: eventType });
    }

    const result = await processPush(app.db, req.body);
    return reply.code(202).send(result);
  });

  // GET /api/github/pushes — liste des pushes (auth requise)
  a.get(
    "/github/pushes",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: z.object({
          limit: z.coerce.number().int().min(1).max(100).default(30),
        }),
      },
    },
    async ({ query }) => {
      const rows = await app.db
        .select({
          id: githubPushes.id,
          branch: githubPushes.branch,
          headSha: githubPushes.headSha,
          commitsCount: githubPushes.commitsCount,
          detectedAt: githubPushes.detectedAt,
          reviewCompletedAt: githubPushes.reviewCompletedAt,
          repoFullName: githubRepos.fullName,
        })
        .from(githubPushes)
        .innerJoin(githubRepos, eq(githubRepos.id, githubPushes.repoId))
        .orderBy(desc(githubPushes.detectedAt))
        .limit(query.limit);
      return rows;
    },
  );

  // GET /api/github/pushes/:id — détail + review
  a.get(
    "/github/pushes/:id",
    {
      preHandler: [app.authenticate],
      schema: { params: z.object({ id: z.string().uuid() }) },
    },
    async ({ params }) => {
      const [push] = await app.db
        .select()
        .from(githubPushes)
        .where(eq(githubPushes.id, params.id))
        .limit(1);
      if (!push) return { push: null, review: null };

      const [review] = await app.db
        .select()
        .from(codeReviews)
        .where(eq(codeReviews.pushId, params.id))
        .limit(1);

      return { push, review: review ?? null };
    },
  );

  // POST /api/github/repos — ajouter un repo à tracker manuellement
  a.post(
    "/github/repos",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          owner: z.string(),
          name: z.string(),
          moduleId: z.string().optional(),
          purpose: z.string().optional(),
        }),
      },
    },
    async ({ body }, reply) => {
      const [inserted] = await app.db
        .insert(githubRepos)
        .values({
          owner: body.owner,
          name: body.name,
          fullName: `${body.owner}/${body.name}`,
          moduleId: body.moduleId ?? null,
          purpose: body.purpose ?? "module_project",
        })
        .onConflictDoNothing()
        .returning();
      return reply.code(201).send(inserted);
    },
  );
};

export default githubRoutes;
