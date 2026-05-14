import webpush from "web-push";
import { eq, sql } from "drizzle-orm";
import type { Database } from "@ph/db";
import { pushSubscriptions, srsCards, userState } from "@ph/db";
import { env } from "../config/env.js";

let configured = false;
function configure() {
  if (configured) return true;
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    return false;
  }
  webpush.setVapidDetails(
    env.VAPID_SUBJECT ?? "mailto:erwin@porterfield.dev",
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
  configured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
};

export async function sendPush(
  db: Database,
  payload: PushPayload,
): Promise<{ sent: number; failed: number }> {
  if (!configure()) {
    return { sent: 0, failed: 0 };
  }

  const subs = await db.select().from(pushSubscriptions);
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent++;
        await db
          .update(pushSubscriptions)
          .set({ lastUsedAt: new Date(), failureCount: 0 })
          .where(eq(pushSubscriptions.id, sub.id));
      } catch (err) {
        failed++;
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          // Endpoint gone → delete
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.id, sub.id));
        } else {
          await db
            .update(pushSubscriptions)
            .set({
              failureCount: sql`${pushSubscriptions.failureCount} + 1`,
            })
            .where(eq(pushSubscriptions.id, sub.id));
        }
      }
    }),
  );

  return { sent, failed };
}

/**
 * Cron tick: si > 10 cartes SRS dues maintenant, envoie une notif au matin.
 * Appelé toutes les heures par le scheduler.
 */
export async function maybeSendSrsReminder(db: Database): Promise<void> {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8 || hour >= 10) return; // créneau 8h-10h local

  const [counts] = await db
    .select({
      dueNow: sql<number>`count(*) filter (where ${srsCards.dueAt} <= ${now})::int`,
    })
    .from(srsCards);

  const due = counts?.dueNow ?? 0;
  if (due < 5) return;

  const [user] = await db.select().from(userState).where(eq(userState.id, 1)).limit(1);
  const streak = user?.streakDays ?? 0;

  await sendPush(db, {
    title: `${due} cartes à réviser`,
    body:
      streak > 0
        ? `Tu es à ${streak} jours d'affilée. Ne casse pas la chaîne.`
        : "C'est l'heure des révisions du jour.",
    url: "/srs",
    tag: "srs-daily",
    icon: "/icons/icon-192.png",
  });
}
