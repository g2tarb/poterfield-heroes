"use client";

import Link from "next/link";

type Progression = {
  user: {
    displayName: string;
    currentXp: number;
    streakDays: number;
    longestStreak: number;
  };
  currentLevel: {
    id: number;
    name: string;
    icon: string | null;
    description: string;
  } | null;
  nextLevel: { name: string; xpRequired: number } | null;
  xpToNext: number;
  progressPct: number;
};

type SrsStats = { dueNow: number; total: number };

type Props = {
  progression: Progression | null;
  srs: SrsStats | null;
  modulesCompleted: number;
  modulesTotal: number;
};

export function ProgressionPanel({
  progression,
  srs,
  modulesCompleted,
  modulesTotal,
}: Props) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
      {/* Bloc Palier */}
      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl">
            {progression?.currentLevel?.icon ?? "🌱"}
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Palier {progression?.currentLevel?.id ?? 1}
            </p>
            <p className="text-lg font-semibold leading-tight">
              {progression?.currentLevel?.name ?? "Init"}
            </p>
          </div>
        </div>

        {progression?.currentLevel?.description && (
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-fg-secondary)]">
            {progression.currentLevel.description}
          </p>
        )}

        <div className="mt-5">
          <div className="flex items-baseline justify-between font-mono text-xs">
            <span className="tabular-nums">
              <span className="text-[var(--color-fg-primary)]">
                {progression?.user.currentXp ?? 0}
              </span>
              <span className="text-[var(--color-fg-muted)]"> XP</span>
            </span>
            {progression?.nextLevel ? (
              <span className="text-[var(--color-fg-muted)]">
                → {progression.nextLevel.xpRequired}
              </span>
            ) : (
              <span className="text-[var(--color-success)]">max</span>
            )}
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-700"
              style={{ width: `${progression?.progressPct ?? 0}%` }}
            />
          </div>
          {progression?.nextLevel && (
            <p className="mt-1.5 font-mono text-[10px] text-[var(--color-fg-muted)]">
              Prochain : {progression.nextLevel.name} ({progression.xpToNext}{" "}
              XP restants)
            </p>
          )}
        </div>
      </section>

      {/* Bloc Streak + Modules */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Série
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {progression?.user.streakDays ?? 0}
            <span className="ml-1 text-xs font-normal text-[var(--color-fg-muted)]">
              j
            </span>
          </p>
          {progression?.user.longestStreak && progression.user.longestStreak > 0 ? (
            <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
              record {progression.user.longestStreak}j
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Modules
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {modulesCompleted}
            <span className="text-base text-[var(--color-fg-muted)]">
              /{modulesTotal}
            </span>
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
            {Math.round((modulesCompleted / Math.max(1, modulesTotal)) * 100)}%
          </p>
        </div>
      </section>

      {/* Bloc SRS — CTA si cartes due */}
      {srs && srs.dueNow > 0 ? (
        <Link
          href="/srs"
          className="block rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] p-4 transition hover:bg-[var(--color-bg-high)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
            Révision du jour
          </p>
          <p className="mt-2 text-lg font-semibold">
            {srs.dueNow} carte{srs.dueNow > 1 ? "s" : ""} à réviser
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
            Maintenant →
          </p>
        </Link>
      ) : srs && srs.total === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-transparent p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            SRS
          </p>
          <p className="mt-2 text-xs text-[var(--color-fg-secondary)]">
            Aucune carte encore. Termine un skill pour générer tes premières
            flashcards.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            SRS
          </p>
          <p className="mt-2 text-sm text-[var(--color-success)]">
            ✓ Tout est à jour
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
            {srs?.total ?? 0} carte{(srs?.total ?? 0) > 1 ? "s" : ""} au total
          </p>
        </div>
      )}
    </aside>
  );
}
