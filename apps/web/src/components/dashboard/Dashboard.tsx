"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { LearningPath, LearningPathSkeleton } from "./LearningPath";
import { ProgressionPanel } from "./ProgressionPanel";
import { CodeRain } from "../ambient/CodeRain";
import { FocusedModuleProvider } from "../ambient/FocusedModuleContext";
import { CodeNoirUnlock } from "../ambient/CodeNoirUnlock";
import { OnboardingTip } from "./OnboardingTip";

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

type ModuleSummary = {
  id: string;
  moduleNumber: number;
  phase: number;
  title: string;
  subtitle: string | null;
  estimatedHours: number;
  status: "locked" | "active" | "completed";
};

type SrsStats = { dueNow: number; total: number };

export function Dashboard() {
  const [progression, setProgression] = useState<Progression | null>(null);
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [srs, setSrs] = useState<SrsStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [p, m, s] = await Promise.all([
          apiFetch<Progression>("/api/progress/state"),
          apiFetch<ModuleSummary[]>("/api/modules"),
          apiFetch<SrsStats>("/api/srs/stats"),
        ]);
        setProgression(p);
        setModules(m);
        setSrs(s);
      } catch (err) {
        console.error("[dashboard] failed to load", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const modulesCompleted = modules.filter((m) => m.status === "completed").length;
  const activeModule = modules.find((m) => m.status === "active") ?? null;
  const defaultModuleNumber = activeModule?.moduleNumber ?? null;

  return (
    <FocusedModuleProvider defaultModule={defaultModuleNumber}>
      <CodeRain />
      <CodeNoirUnlock />
      <OnboardingTip />

      {/* Bandeau mobile compact : palier + jauge XP + streak + SRS */}
      <MobileProgressBar
        progression={progression}
        srs={srs}
      />

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        {/* LearningPath central (toujours en order-2 mobile pour passer après le bandeau) */}
        <div className="order-2 min-w-0 lg:order-1">
          {loaded && modules.length > 0 ? (
            <LearningPath modules={modules} />
          ) : (
            <LearningPathSkeleton />
          )}
        </div>

        {/* ProgressionPanel détaillé : desktop only (mobile = MobileProgressBar) */}
        <div className="order-1 hidden lg:order-2 lg:block">
          {loaded && progression && (
            <ProgressionPanel
              progression={progression}
              srs={srs}
              modulesCompleted={modulesCompleted}
              modulesTotal={modules.length || 5}
            />
          )}
        </div>
      </div>
    </FocusedModuleProvider>
  );
}

function MobileProgressBar({
  progression,
  srs,
}: {
  progression: Progression | null;
  srs: SrsStats | null;
}) {
  if (!progression) {
    return (
      <div className="ph-panel mb-4 h-14 animate-pulse lg:hidden" />
    );
  }

  const pct = progression.progressPct;
  const streak = progression.user.streakDays;
  const due = srs?.dueNow ?? 0;
  const xp = progression.user.currentXp;

  return (
    <div className="ph-panel ph-rivets relative mb-4 overflow-hidden lg:hidden">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-3 py-2.5">
        {/* Palier */}
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-lg" aria-hidden>
            {progression.currentLevel?.icon ?? "🌱"}
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Palier
            </span>
            <span className="max-w-[80px] truncate font-mono text-[10px] font-bold uppercase tracking-wider">
              {progression.currentLevel?.name ?? "Init"}
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="min-w-0">
          <div
            className="h-2 overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-bg-base)]"
            style={{ borderRadius: 2 }}
          >
            <div
              className="ph-stripes h-full bg-[var(--color-accent)] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-0.5 font-mono text-[9px] tabular-nums text-[var(--color-fg-muted)]">
            {xp} XP{" "}
            {progression.nextLevel && (
              <span>
                · {progression.xpToNext} → {progression.nextLevel.name}
              </span>
            )}
          </p>
        </div>

        {/* Streak */}
        <div className="flex min-w-[36px] flex-col items-center" title={`Série ${streak}j`}>
          <span
            className={
              streak > 0
                ? "ph-streak-pulse text-base"
                : "text-base grayscale opacity-50"
            }
            aria-hidden
          >
            🔥
          </span>
          <span className="font-mono text-[10px] font-bold tabular-nums">
            {streak}
          </span>
        </div>

        {/* SRS due */}
        {due > 0 && (
          <Link
            href="/srs"
            className="relative flex min-w-[36px] flex-col items-center"
            aria-label={`${due} cartes SRS à réviser`}
          >
            <span className="text-base" aria-hidden>
              🧠
            </span>
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 font-mono text-[9px] font-bold text-[var(--color-accent-fg)]">
              {due}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
