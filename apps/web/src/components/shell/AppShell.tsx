"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CoachPanel } from "@/components/coach/CoachPanel";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { LevelUpReveal } from "@/components/ambient/LevelUpReveal";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

type Level = { id: number; name: string; icon: string | null };
type Progression = { currentLevel: Level | null };

const LAST_LEVEL_KEY = "ph_last_seen_level_id";

function useModuleIdFromPath(pathname: string | null): string | undefined {
  if (!pathname) return undefined;
  const match = pathname.match(/^\/modules\/([^/]+)/);
  return match ? match[1] : undefined;
}

function useLevelUpDetector(): { reveal: Level | null; close: () => void } {
  const [reveal, setReveal] = useState<Level | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiFetch<Progression>("/api/progress/state");
        const current = data.currentLevel;
        if (!current || cancelled) return;
        const stored = Number(localStorage.getItem(LAST_LEVEL_KEY) ?? "0");
        if (stored > 0 && current.id > stored) {
          setReveal(current);
        }
        localStorage.setItem(LAST_LEVEL_KEY, String(current.id));
      } catch {
        /* silently ignore — user probably not authenticated yet */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { reveal, close: () => setReveal(null) };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const moduleId = useModuleIdFromPath(pathname);
  const { reveal, close } = useLevelUpDetector();

  const hideChrome =
    pathname === "/login" || pathname?.startsWith("/p/") === true;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <div className="pb-[calc(env(safe-area-inset-bottom)+64px)] lg:pb-0">
        {children}
      </div>
      <BottomNav />
      <CoachPanel {...(moduleId ? { moduleId } : {})} />
      <FocusTimer />
      <LevelUpReveal level={reveal} onClose={close} />
    </>
  );
}
