"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Staircase } from "../staircase/Staircase";
import { ProgressionPanel } from "../staircase/ProgressionPanel";

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
      }
    })();
  }, []);

  const modulesCompleted = modules.filter((m) => m.status === "completed").length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
      {/* Panel : 1er sur mobile (au-dessus), 2e sur desktop (à droite sticky) */}
      <div className="order-1 lg:order-2">
        <ProgressionPanel
          progression={progression}
          srs={srs}
          modulesCompleted={modulesCompleted}
          modulesTotal={modules.length || 25}
        />
      </div>

      {/* Escalier */}
      <div className="order-2 min-w-0 lg:order-1">
        <Staircase modules={modules} />
      </div>
    </div>
  );
}
