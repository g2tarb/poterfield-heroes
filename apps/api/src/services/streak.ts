import { eq, sql } from "drizzle-orm";
import type { Database } from "@ph/db";
import { userState } from "@ph/db";

/**
 * Touch the streak: appelée à chaque action utilisateur significative
 * (exercise attempt, video progress, srs review, exam submission).
 *
 * Logique :
 * - Si lastActiveAt est aujourd'hui → no-op (streak inchangé)
 * - Si hier (dans la fenêtre 24-36h) → streak +1
 * - Si > 36h → streak reset à 1 (la session courante est jour 1)
 * - Met à jour longestStreak si dépassé
 */
export async function touchStreak(db: Database): Promise<{
  streakDays: number;
  longestStreak: number;
  bumped: boolean;
}> {
  const [state] = await db.select().from(userState).where(eq(userState.id, 1)).limit(1);
  if (!state) return { streakDays: 0, longestStreak: 0, bumped: false };

  const now = new Date();
  const last = state.lastActiveAt;

  let newStreak = state.streakDays;
  let bumped = false;

  if (!last) {
    // Première activité jamais
    newStreak = 1;
    bumped = true;
  } else {
    const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    const sameDay =
      last.toDateString() === now.toDateString();

    if (sameDay) {
      // Déjà actif aujourd'hui — pas de bump
      bumped = false;
    } else if (diffHours <= 36) {
      // Hier ou cette nuit → streak +1
      newStreak += 1;
      bumped = true;
    } else {
      // Plus de 36h → reset (la session courante = jour 1)
      newStreak = 1;
      bumped = true;
    }
  }

  const newLongest = Math.max(state.longestStreak, newStreak);

  await db
    .update(userState)
    .set({
      streakDays: newStreak,
      longestStreak: newLongest,
      lastActiveAt: now,
    })
    .where(eq(userState.id, 1));

  return { streakDays: newStreak, longestStreak: newLongest, bumped };
}

/**
 * Cron tick : check si streak doit être reset (inactivité > 36h).
 * Sans cron, le reset se fait passivement à la prochaine action.
 * Avec cron, on peut envoyer une notif "streak en danger".
 */
export async function maybeWarnStreakAtRisk(db: Database): Promise<boolean> {
  const [state] = await db.select().from(userState).where(eq(userState.id, 1)).limit(1);
  if (!state || !state.lastActiveAt || state.streakDays === 0) return false;

  const hoursSince = (Date.now() - state.lastActiveAt.getTime()) / (1000 * 60 * 60);

  // Entre 24h et 36h : streak vivant mais à risque
  return hoursSince >= 24 && hoursSince < 36;
}

/**
 * Bump XP via le streak (milestones 7, 30, 100 jours)
 * À appeler dans `touchStreak` côté caller si on veut.
 */
export function getStreakMilestone(streakDays: number): null | { kind: "7" | "30" | "100"; xp: number } {
  if (streakDays === 7) return { kind: "7", xp: 50 };
  if (streakDays === 30) return { kind: "30", xp: 200 };
  if (streakDays === 100) return { kind: "100", xp: 1000 };
  return null;
}
