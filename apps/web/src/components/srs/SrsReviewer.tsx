"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/coach/Markdown";
import Link from "next/link";

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
  hint: string;
  color: string;
}> = [
  {
    rating: 1,
    label: "Raté",
    key: "1",
    hint: "<10 min",
    color: "border-[var(--color-danger)] text-[var(--color-danger)]",
  },
  {
    rating: 2,
    label: "Difficile",
    key: "2",
    hint: "demain",
    color: "border-[var(--color-warning)] text-[var(--color-warning)]",
  },
  {
    rating: 3,
    label: "Bon",
    key: "3",
    hint: "3-5j",
    color: "border-[var(--color-fg-primary)] text-[var(--color-fg-primary)]",
  },
  {
    rating: 4,
    label: "Facile",
    key: "4",
    hint: "1sem+",
    color: "border-[var(--color-success)] text-[var(--color-success)]",
  },
];

function formatInterval(days: number): string {
  if (days < 1 / 24) return "< 1h";
  if (days < 1) return `${Math.round(days * 24)}h`;
  if (days < 30) return `${Math.round(days)}j`;
  if (days < 365) return `${Math.round(days / 30)}mois`;
  return `${Math.round(days / 365)}an`;
}

const STATE_LABELS: Record<Card["state"], string> = {
  new: "nouveau",
  learning: "apprentissage",
  review: "révision",
  mature: "mature",
  suspended: "suspendu",
};

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
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
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

  const total = cards?.length ?? 0;
  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  if (!cards) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-6 h-1.5 rounded-full bg-[var(--color-bg-elevated)]" />
        <div className="h-64 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]" />
        <div className="mt-6 h-14 rounded-xl bg-[var(--color-bg-elevated)]" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="ph-panel ph-rivets relative mx-auto max-w-md overflow-hidden p-8 text-center">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <p className="text-4xl" aria-hidden>
          ✅
        </p>
        <p className="mt-4 text-xl font-semibold uppercase tracking-wide">Aucune carte à réviser.</p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Rien n&apos;arrive à échéance pour l&apos;instant. Reviens demain ou
          continue un module.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[var(--color-accent)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-fg)]"
        >
          Retour à l&apos;atelier
        </Link>
      </div>
    );
  }

  if (index >= cards.length) {
    return (
      <div className="ph-panel ph-rivets relative mx-auto max-w-md overflow-hidden border-l-4 border-l-[var(--color-success)] p-8 text-center">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <p className="text-4xl" aria-hidden>
          🎉
        </p>
        <p className="mt-4 text-xl font-semibold uppercase tracking-wide">Session terminée.</p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          {cards.length} carte{cards.length > 1 ? "s" : ""} traitée
          {cards.length > 1 ? "s" : ""}. Reviens demain ou continue un module.
        </p>
        {lastResult && (
          <p className="mt-4 font-mono text-xs text-[var(--color-fg-muted)]">
            Dernière carte → prochain rappel dans{" "}
            <span className="text-[var(--color-fg-primary)]">
              {formatInterval(lastResult.intervalDays)}
            </span>
          </p>
        )}
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[var(--color-accent)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-fg)]"
        >
          Retour à l&apos;atelier
        </Link>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar + header sticky */}
      <header className="mb-6 space-y-3">
        <div className="flex items-baseline justify-between font-mono text-xs">
          <span className="text-[var(--color-fg-muted)]">
            <span className="text-[var(--color-fg-primary)] tabular-nums">
              {index + 1}
            </span>
            <span> / {total}</span>
            <span className="ml-3 uppercase tracking-wider">
              {STATE_LABELS[current.state]}
            </span>
          </span>
          <span className="truncate text-[var(--color-fg-muted)]">
            {current.moduleTitle}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Card */}
      <article
        className={cn(
          "ph-panel ph-rivets relative overflow-hidden p-6 transition-all duration-300 sm:p-8",
          revealed && "border-l-4 border-l-[var(--color-accent)]",
        )}
      >
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          {current.skillLabel}
        </p>
        <div className="text-xl leading-relaxed">
          <Markdown source={current.front} />
        </div>

        {revealed && (
          <div className="ph-fade-up">
            <hr className="my-6 border-[var(--color-border-subtle)]" />
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-success)]">
              Réponse
            </p>
            <div className="text-base leading-relaxed">
              <Markdown source={current.back} />
            </div>
          </div>
        )}
      </article>

      {/* Actions */}
      <div className="mt-6">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] py-4 font-mono text-sm font-semibold uppercase tracking-wider transition active:scale-[0.98] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-elevated)]"
          >
            Voir la réponse
            <span className="ml-2 hidden font-mono text-xs opacity-60 sm:inline">
              [espace]
            </span>
          </button>
        ) : (
          <>
            <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Comment ça s&apos;est passé ?
            </p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {RATING_BUTTONS.map((b) => (
                <button
                  key={b.rating}
                  type="button"
                  onClick={() => submit(b.rating)}
                  disabled={submitting}
                  className={cn(
                    "group rounded-xl border-2 bg-[var(--color-bg-elevated)] px-3 py-4 transition active:scale-[0.96] hover:bg-[var(--color-bg-high)] disabled:cursor-not-allowed disabled:opacity-40",
                    b.color,
                  )}
                >
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-semibold">{b.label}</span>
                    <span className="hidden font-mono text-[10px] opacity-50 sm:inline">
                      {b.key}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
                    +{b.hint}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
