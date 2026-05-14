"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";

type Card = {
  id: string;
  front: string;
  back: string;
  state: "new" | "learning" | "review" | "mature" | "suspended";
  moduleId: string;
  moduleTitle: string;
  skillId: string;
  skillLabel: string;
};

type DueResponse = {
  dueCards: Card[];
  newCards: Card[];
};

type ReviewResponse = {
  ok: true;
  nextDueAt: string;
  intervalDays: number;
  state: Card["state"];
};

const RATING_BUTTONS: Array<{
  rating: 1 | 2 | 3 | 4;
  label: string;
  key: string;
  desc: string;
  className: string;
}> = [
  {
    rating: 1,
    label: "Again",
    key: "1",
    desc: "Raté, à revoir vite",
    className:
      "border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-bg-high)]",
  },
  {
    rating: 2,
    label: "Hard",
    key: "2",
    desc: "Difficile, allonger peu",
    className:
      "border-[var(--color-warning)] text-[var(--color-warning)] hover:bg-[var(--color-bg-high)]",
  },
  {
    rating: 3,
    label: "Good",
    key: "3",
    desc: "Bon, intervalle normal",
    className:
      "border-[var(--color-fg-primary)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-high)]",
  },
  {
    rating: 4,
    label: "Easy",
    key: "4",
    desc: "Facile, allonger fort",
    className:
      "border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-bg-high)]",
  },
];

function formatInterval(days: number): string {
  if (days < 1 / 24) return "< 1h";
  if (days < 1) return `${Math.round(days * 24)}h`;
  if (days < 30) return `${Math.round(days)}j`;
  if (days < 365) return `${Math.round(days / 30)}mois`;
  return `${Math.round(days / 365)}an`;
}

export function SrsReviewer() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ReviewResponse | null>(null);
  const [shownStartedAt, setShownStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<DueResponse>(
          "/api/srs/due?limit=50&newPerSession=10",
        );
        if (cancelled) return;
        // New cards first to introduce them, then due cards
        setCards([...data.newCards, ...data.dueCards]);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = cards?.[index];

  const submit = useCallback(
    async (rating: 1 | 2 | 3 | 4) => {
      if (!current || submitting) return;
      setSubmitting(true);
      setError(null);
      const durationMs = Date.now() - shownStartedAt;
      try {
        const res = await apiFetch<ReviewResponse>("/api/srs/review", {
          method: "POST",
          body: JSON.stringify({ cardId: current.id, rating, durationMs }),
        });
        setLastResult(res);
        setIndex((i) => i + 1);
        setRevealed(false);
        setShownStartedAt(Date.now());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
    [current, submitting, shownStartedAt],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
          submit(Number(e.key) as 1 | 2 | 3 | 4);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, submit]);

  const progressLabel = useMemo(() => {
    if (!cards) return "Chargement…";
    return `${Math.min(index, cards.length)} / ${cards.length}`;
  }, [cards, index]);

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  if (!cards) {
    return (
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-fg-secondary)]">
        Chargement des cartes…
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 text-center">
        <p className="text-xl font-semibold">Aucune carte à réviser.</p>
        <p className="mt-2 text-[var(--color-fg-secondary)]">
          Revoir demain. Pour l&apos;instant, lance un module.
        </p>
      </div>
    );
  }

  if (index >= cards.length) {
    return (
      <div className="rounded-lg border border-[var(--color-success)] bg-[var(--color-bg-elevated)] p-8 text-center">
        <p className="text-xl font-semibold">Session terminée.</p>
        <p className="mt-2 text-[var(--color-fg-secondary)]">
          {cards.length} cartes traitées. Reviens demain ou continue un module.
        </p>
        {lastResult && (
          <p className="mt-4 font-mono text-xs text-[var(--color-fg-muted)]">
            Dernière carte : prochain rappel dans{" "}
            {formatInterval(lastResult.intervalDays)} · état{" "}
            {lastResult.state}
          </p>
        )}
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 flex items-baseline justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          {progressLabel} · {current.state}
        </p>
        <p className="font-mono text-xs text-[var(--color-fg-muted)]">
          {current.moduleTitle}
        </p>
      </header>

      <article className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          {current.skillLabel}
        </p>
        <div className="whitespace-pre-wrap text-xl leading-relaxed">
          {current.front}
        </div>

        {revealed && (
          <>
            <hr className="my-6 border-[var(--color-border-subtle)]" />
            <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--color-fg-primary)]">
              {current.back}
            </div>
          </>
        )}
      </article>

      <div className="mt-6">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] py-3 font-mono text-sm uppercase tracking-wider hover:border-[var(--color-accent)]"
          >
            Voir la réponse · espace
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {RATING_BUTTONS.map((b) => (
              <button
                key={b.rating}
                type="button"
                onClick={() => submit(b.rating)}
                disabled={submitting}
                className={cn(
                  "rounded-lg border bg-[var(--color-bg-elevated)] px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
                  b.className,
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">{b.label}</span>
                  <span className="font-mono text-[10px] opacity-60">
                    [{b.key}]
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-[var(--color-fg-muted)]">
                  {b.desc}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
