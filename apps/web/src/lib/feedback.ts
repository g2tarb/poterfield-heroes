/**
 * Event bus minimal pour les feedbacks visuels (XP, confetti, streak).
 * Émet via window.CustomEvent, écouté par <FeedbackOverlay /> dans AppShell.
 *
 * Pourquoi un event bus plutôt qu'un context React :
 * - Pas besoin de wrapper toute l'app
 * - Appelable depuis n'importe où (hooks, handlers, async)
 * - Pas de re-render parasite
 */

export type XpBurstDetail = {
  amount: number;
  source?: string;
};

export type SuccessBurstDetail = {
  origin?: { x: number; y: number };
  message?: string;
};

export type StreakBurstDetail = {
  days: number;
};

const EV_XP = "ph:burst-xp";
const EV_SUCCESS = "ph:burst-success";
const EV_STREAK = "ph:burst-streak";

export function burstXp(amount: number, source?: string): void {
  if (typeof window === "undefined" || amount <= 0) return;
  window.dispatchEvent(
    new CustomEvent<XpBurstDetail>(EV_XP, {
      detail: source !== undefined ? { amount, source } : { amount },
    }),
  );
}

export function burstSuccess(
  origin?: { x: number; y: number },
  message?: string,
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SuccessBurstDetail>(EV_SUCCESS, {
      detail: {
        ...(origin !== undefined ? { origin } : {}),
        ...(message !== undefined ? { message } : {}),
      },
    }),
  );
}

export function burstStreak(days: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<StreakBurstDetail>(EV_STREAK, {
      detail: { days },
    }),
  );
}

export const FEEDBACK_EVENTS = {
  XP: EV_XP,
  SUCCESS: EV_SUCCESS,
  STREAK: EV_STREAK,
} as const;
