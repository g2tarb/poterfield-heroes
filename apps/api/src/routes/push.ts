import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { pushSubscriptions } from "@ph/db";
import { env } from "../config/env.js";
import { sendPush } from "../services/push.js";

const pushRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/push/vapid-public — exposer la clé publique pour le client
  app.get("/push/vapid-public", async () => {
    return { publicKey: env.VAPID_PUBLIC_KEY ?? null };
  });

  // POST /api/push/subscribe — enregistre une subscription navigateur
  a.post(
    "/push/subscribe",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          endpoint: z.string().url(),
          keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
          }),
          userAgent: z.string().optional(),
        }),
      },
    },
    async ({ body }, reply) => {
      await app.db
        .insert(pushSubscriptions)
        .values({
          endpoint: body.endpoint,
          p256dh: body.keys.p256dh,
          auth: body.keys.auth,
          userAgent: body.userAgent ?? null,
        })
        .onConflictDoUpdate({
          target: pushSubscriptions.endpoint,
          set: {
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            failureCount: 0,
          },
        });
      return reply.code(201).send({ ok: true });
    },
  );

  // POST /api/push/unsubscribe
  a.post(
    "/push/unsubscribe",
    {
      preHandler: [app.authenticate],
      schema: { body: z.object({ endpoint: z.string().url() }) },
    },
    async ({ body }) => {
      await app.db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, body.endpoint));
      return { ok: true };
    },
  );

  // POST /api/push/test — envoyer une notif test
  a.post(
    "/push/test",
    { preHandler: [app.authenticate] },
    async () => {
      const result = await sendPush(app.db, {
        title: "Porterfield Heroes",
        body: "Test de notification — tout fonctionne.",
        url: "/",
        tag: "test",
      });
      return result;
    },
  );
};

export default pushRoutes;
