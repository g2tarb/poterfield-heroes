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
  const completionPct = Math.round(
    (modulesCompleted / Math.max(1, modulesTotal)) * 100,
  );

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      {/* Panneau Palier — module principal */}
      <section className="ph-panel ph-rivets relative overflow-hidden">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />

        <header className="ph-station-header flex items-center justify-between px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
            Palier {progression?.currentLevel?.id ?? 1}
          </span>
          <span className="ph-ref">REF-LVL</span>
        </header>

        <div className="px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl">
              {progression?.currentLevel?.icon ?? "🌱"}
            </span>
            <div>
              <p className="text-base font-bold uppercase leading-tight tracking-wide">
                {progression?.currentLevel?.name ?? "Init"}
              </p>
            </div>
          </div>

          {progression?.currentLevel?.description && (
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-fg-secondary)]">
              {progression.currentLevel.description}
            </p>
          )}

          {/* Jauge XP industrielle */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="tabular-nums text-[var(--color-fg-primary)]">
                {progression?.user.currentXp ?? 0}
                <span className="text-[var(--color-fg-muted)]"> XP</span>
              </span>
              {progression?.nextLevel ? (
                <span className="text-[var(--color-fg-muted)] tabular-nums">
                  / {progression.nextLevel.xpRequired}
                </span>
              ) : (
                <span className="text-[var(--color-success)]">MAX</span>
              )}
            </div>
            <div
              className="mt-2 h-2 overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-bg-base)]"
              style={{ borderRadius: 2 }}
            >
              <div
                className="ph-stripes h-full bg-[var(--color-accent)] transition-all duration-700"
                style={{ width: `${progression?.progressPct ?? 0}%` }}
              />
            </div>
            {progression?.nextLevel && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                → {progression.nextLevel.name} · {progression.xpToNext} XP
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Compteurs jumeaux : Série + Modules */}
      <section className="grid grid-cols-2 gap-3">
        <Gauge
          label="Série"
          value={progression?.user.streakDays ?? 0}
          unit="j"
          sub={
            progression?.user.longestStreak && progression.user.longestStreak > 0
              ? `record ${progression.user.longestStreak}j`
              : null
          }
        />
        <Gauge
          label="Modules"
          value={modulesCompleted}
          unit={`/${modulesTotal}`}
          sub={`${completionPct}%`}
        />
      </section>

      {/* Panneau SRS */}
      {srs && srs.dueNow > 0 ? (
        <Link href="/srs" className="ph-panel ph-rivets group relative block overflow-hidden border-l-4 border-l-[var(--color-accent)]">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <div className="ph-stripes pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <header className="ph-station-header relative flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Révision du jour
            </span>
            <span className="ph-ref">SRS-DUE</span>
          </header>
          <div className="relative px-5 py-4">
            <p className="text-2xl font-bold tabular-nums">
              {srs.dueNow}
              <span className="ml-2 text-xs font-normal uppercase tracking-widest text-[var(--color-fg-secondary)]">
                carte{srs.dueNow > 1 ? "s" : ""}
              </span>
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)]">
              démarrer →
            </p>
          </div>
        </Link>
      ) : srs && srs.total === 0 ? (
        <section className="ph-panel relative overflow-hidden">
          <header className="ph-station-header flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
              SRS
            </span>
            <span className="ph-ref">EMPTY</span>
          </header>
          <p className="px-5 py-4 text-xs leading-relaxed text-[var(--color-fg-secondary)]">
            Aucune carte. Termine un skill pour générer tes premières flashcards.
          </p>
        </section>
      ) : (
        <section className="ph-panel relative overflow-hidden">
          <header className="ph-station-header flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
              SRS
            </span>
            <span className="ph-ref">SYNCED</span>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm font-semibold text-[var(--color-success)]">
              ✓ Tout est à jour
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              {srs?.total ?? 0} carte{(srs?.total ?? 0) > 1 ? "s" : ""} en stock
            </p>
          </div>
        </section>
      )}
    </aside>
  );
}

function Gauge({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: number;
  unit: string;
  sub: string | null;
}) {
  return (
    <div className="ph-panel ph-rivets relative overflow-hidden px-4 py-3">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {value}
        <span className="ml-0.5 text-xs font-normal text-[var(--color-fg-muted)]">
          {unit}
        </span>
      </p>
      {sub && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
          {sub}
        </p>
      )}
    </div>
  );
}
