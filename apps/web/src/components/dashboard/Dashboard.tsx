"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RadarChart12, type RadarAxis } from "./RadarChart12";
import { ConstellationsBackground } from "../ambient/Constellations";

type Progression = {
  user: {
    displayName: string;
    avatarUrl: string | null;
    currentXp: number;
    streakDays: number;
    longestStreak: number;
    startedAt: string;
  };
  currentLevel: {
    id: number;
    slug: string;
    name: string;
    icon: string | null;
    xpRequired: number;
    description: string;
    projectExamples: string[];
  } | null;
  nextLevel: {
    id: number;
    slug: string;
    name: string;
    xpRequired: number;
  } | null;
  xpToNext: number;
  progressPct: number;
};

type ModuleSummary = {
  id: string;
  moduleNumber: number;
  phase: number;
  title: string;
  subtitle: string | null;
  estimatedHours: number;
  status: "locked" | "active" | "completed";
};

type SrsStats = {
  total: number;
  dueNow: number;
  newCount: number;
  matureCount: number;
};

export function Dashboard() {
  const [progression, setProgression] = useState<Progression | null>(null);
  const [radar, setRadar] = useState<RadarAxis[] | null>(null);
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [srs, setSrs] = useState<SrsStats | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [p, r, m, s] = await Promise.all([
          apiFetch<Progression>("/api/progress/state"),
          apiFetch<RadarAxis[]>("/api/progress/radar"),
          apiFetch<ModuleSummary[]>("/api/modules"),
          apiFetch<SrsStats>("/api/srs/stats"),
        ]);
        setProgression(p);
        setRadar(r);
        setModules(m);
        setSrs(s);
      } catch (err) {
        console.error("[dashboard] failed to load", err);
      }
    })();
  }, []);

  const activeModule = modules.find((m) => m.status === "active");
  const nextLocked = modules.find((m) => m.status === "locked");

  return (
    <div className="space-y-12">
      <ConstellationsBackground
        modules={modules.map((m) => ({
          moduleNumber: m.moduleNumber,
          phase: m.phase,
          status: m.status,
        }))}
      />
      {/* Hero band */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            {progression?.currentLevel?.icon ?? "🌱"} Palier{" "}
            {progression?.currentLevel?.id ?? 1}
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
            {progression?.currentLevel?.name ?? "Init"}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--color-fg-secondary)]">
            {progression?.currentLevel?.description ?? "Le voyage commence."}
          </p>

          <div className="mt-6">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="text-[var(--color-fg-muted)]">
                {progression?.user.currentXp ?? 0} XP
              </span>
              {progression?.nextLevel ? (
                <span className="text-[var(--color-fg-muted)]">
                  → {progression.nextLevel.name} (
                  {progression.nextLevel.xpRequired} XP)
                </span>
              ) : (
                <span className="text-[var(--color-success)]">
                  Palier max atteint
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                style={{
                  width: `${progression?.progressPct ?? 0}%`,
                }}
              />
            </div>
          </div>

          {progression?.currentLevel?.projectExamples &&
            progression.currentLevel.projectExamples.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  Projets que tu peux désormais construire
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-secondary)]">
                  {progression.currentLevel.projectExamples.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--color-fg-muted)]">·</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          <StatTile
            label="Série en cours"
            value={`${progression?.user.streakDays ?? 0} j`}
            sub={`Record : ${progression?.user.longestStreak ?? 0} j`}
          />
          <StatTile
            label="Cartes dues"
            value={`${srs?.dueNow ?? 0}`}
            sub={`${srs?.matureCount ?? 0} mature · ${srs?.total ?? 0} total`}
            href="/srs"
            cta="Réviser →"
          />
        </div>
      </section>

      {/* Radar */}
      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
        <header className="mb-6 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">Mastery — 12 axes</h3>
          <p className="font-mono text-xs text-[var(--color-fg-muted)]">
            Pondéré par skill mastery
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
          <div className="flex items-center justify-center">
            {radar && radar.length > 0 ? (
              <RadarChart12 axes={radar} size={380} />
            ) : (
              <p className="py-12 text-sm text-[var(--color-fg-muted)]">
                Radar vide. Termine ton premier exercice pour voir la
                progression.
              </p>
            )}
          </div>
          <ul className="space-y-1.5">
            {radar?.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: a.colorHex }}
                  />
                  <span className="text-[var(--color-fg-secondary)]">
                    {a.label}
                  </span>
                </span>
                <span className="font-mono text-[var(--color-fg-muted)]">
                  {a.score}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">Roadmap (25 modules)</h3>
          <Link
            href="/notebook"
            className="font-mono text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
          >
            Carnet →
          </Link>
        </div>

        {activeModule && (
          <ActiveModuleCard module={activeModule} />
        )}

        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {modules
            .filter((m) => m !== activeModule)
            .map((m) => (
              <li key={m.id}>
                <ModuleListItem module={m} isNext={m === nextLocked} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  href,
  cta,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  cta?: string;
}) {
  const content = (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      {sub && (
        <p className="mt-auto font-mono text-[10px] text-[var(--color-fg-muted)]">
          {sub}
        </p>
      )}
      {cta && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
          {cta}
        </p>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:opacity-90">
      {content}
    </Link>
  ) : (
    content
  );
}

function ActiveModuleCard({ module: m }: { module: ModuleSummary }) {
  return (
    <Link
      href={`/modules/${m.id}`}
      className="block rounded-2xl border border-[var(--color-accent)] bg-[var(--color-bg-elevated)] p-6 transition hover:bg-[var(--color-bg-high)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          En cours · M{String(m.moduleNumber).padStart(2, "0")}
        </p>
        <p className="font-mono text-xs text-[var(--color-fg-muted)]">
          {m.estimatedHours}h
        </p>
      </div>
      <h4 className="mt-2 text-xl font-semibold">{m.title}</h4>
      {m.subtitle && (
        <p className="mt-1 text-[var(--color-fg-secondary)]">{m.subtitle}</p>
      )}
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">
        Reprendre →
      </p>
    </Link>
  );
}

function ModuleListItem({
  module: m,
  isNext,
}: {
  module: ModuleSummary;
  isNext: boolean;
}) {
  return (
    <Link
      href={`/modules/${m.id}`}
      className="block h-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-high)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
          M{String(m.moduleNumber).padStart(2, "0")} · Phase {m.phase}
        </span>
        <span
          className={
            m.status === "completed"
              ? "rounded-full border border-[var(--color-success)] px-1.5 font-mono text-[9px] uppercase text-[var(--color-success)]"
              : isNext
                ? "rounded-full border border-[var(--color-accent)] px-1.5 font-mono text-[9px] uppercase text-[var(--color-accent)]"
                : "rounded-full border border-[var(--color-border-subtle)] px-1.5 font-mono text-[9px] uppercase text-[var(--color-fg-muted)]"
          }
        >
          {m.status === "completed"
            ? "Validé"
            : isNext
              ? "Prochain"
              : m.status === "locked"
                ? "Verrouillé"
                : "—"}
        </span>
      </div>
      <h4 className="mt-2 text-sm font-semibold leading-snug">{m.title}</h4>
      <p className="mt-3 font-mono text-[10px] text-[var(--color-fg-muted)]">
        {m.estimatedHours}h
      </p>
    </Link>
  );
}
