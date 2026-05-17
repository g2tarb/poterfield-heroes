"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Staircase } from "../staircase/Staircase";
import { ProgressionPanel } from "../staircase/ProgressionPanel";
import {
  StaircaseSkeleton,
  ProgressionPanelSkeleton,
} from "../staircase/StaircaseSkeleton";
import { CodeRain } from "../ambient/CodeRain";
import { FocusedModuleProvider } from "../ambient/FocusedModuleContext";

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
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <div className="order-1 lg:order-2">
          {loaded && progression ? (
            <ProgressionPanel
              progression={progression}
              srs={srs}
              modulesCompleted={modulesCompleted}
              modulesTotal={modules.length || 25}
            />
          ) : (
            <ProgressionPanelSkeleton />
          )}
        </div>

        <div className="order-2 min-w-0 lg:order-1">
          {loaded && modules.length > 0 ? (
            <Staircase modules={modules} />
          ) : (
            <StaircaseSkeleton />
          )}
        </div>
      </div>
    </FocusedModuleProvider>
  );
}
