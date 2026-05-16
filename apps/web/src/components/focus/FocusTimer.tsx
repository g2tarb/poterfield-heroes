"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

type Phase = "idle" | "focus" | "break";

const PRESETS = {
  classic: { focus: 25, break: 5 },
  long: { focus: 50, break: 10 },
  deep: { focus: 90, break: 20 },
} as const;
type PresetKey = keyof typeof PRESETS;

const STORAGE_KEY = "ph_focus_state_v1";

type StoredState = {
  sessionsToday: number;
  lastSessionDate: string; // YYYY-MM-DD
  preset: PresetKey;
};

function loadState(): StoredState {
  if (typeof window === "undefined")
    return { sessionsToday: 0, lastSessionDate: "", preset: "classic" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessionsToday: 0, lastSessionDate: "", preset: "classic" };
    const parsed = JSON.parse(raw) as StoredState;
    // Reset daily counter
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.lastSessionDate !== today) {
      return { ...parsed, sessionsToday: 0 };
    }
    return parsed;
  } catch {
    return { sessionsToday: 0, lastSessionDate: "", preset: "classic" };
  }
}

function saveState(state: StoredState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function notify(title: string, body: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icons/icon-192.png" });
  }
}

export function FocusTimer() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stored, setStored] = useState<StoredState>(() => loadState());
  const [remaining, setRemaining] = useState<number>(
    PRESETS[loadState().preset].focus * 60,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = PRESETS[stored.preset];

  const tick = useCallback(() => {
    setRemaining((r) => {
      if (r <= 1) {
        // End of phase
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (phase === "focus") {
          // Session complétée
          const today = new Date().toISOString().slice(0, 10);
          const next: StoredState = {
            ...stored,
            sessionsToday:
              stored.lastSessionDate === today ? stored.sessionsToday + 1 : 1,
            lastSessionDate: today,
          };
          setStored(next);
          saveState(next);
          notify("Focus terminé", `Pause de ${preset.break} min. Tu en es à ${next.sessionsToday} session${next.sessionsToday > 1 ? "s" : ""} aujourd'hui.`);
          setPhase("break");
          return preset.break * 60;
        }
        if (phase === "break") {
          notify("Pause terminée", "Prêt pour une autre session ?");
          setPhase("idle");
          return preset.focus * 60;
        }
        return 0;
      }
      return r - 1;
    });
  }, [phase, preset, stored]);

  useEffect(() => {
    if (phase === "idle") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, tick]);

  function start() {
    if (typeof window !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }
    setRemaining(preset.focus * 60);
    setPhase("focus");
  }
  function pauseResume() {
    if (phase === "idle") return start();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase((p) => (p === "focus" ? "idle" : p === "break" ? "idle" : "focus"));
  }
  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("idle");
    setRemaining(preset.focus * 60);
  }
  function setPreset(k: PresetKey) {
    const next = { ...stored, preset: k };
    setStored(next);
    saveState(next);
    setRemaining(PRESETS[k].focus * 60);
    setPhase("idle");
  }

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const totalPhase = phase === "break" ? preset.break * 60 : preset.focus * 60;
  const progress = totalPhase > 0 ? 1 - remaining / totalPhase : 0;

  return (
    <>
      {/* Toggle button — au-dessus à droite du coach */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Focus timer"
        className={cn(
          "fixed right-4 bottom-20 z-30 size-12 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] font-mono text-xs uppercase tracking-wider shadow-lg transition hover:border-[var(--color-accent)]",
          phase === "focus" && "border-[var(--color-accent)] text-[var(--color-accent)]",
          phase === "break" && "border-[var(--color-success)] text-[var(--color-success)]",
        )}
      >
        {phase === "idle" ? "▶" : `${mm}:${String(ss).padStart(2, "0")}`}
      </button>

      {open && (
        <div className="fixed right-4 bottom-36 z-30 w-72 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5 shadow-2xl">
          <header className="mb-4 flex items-baseline justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              {phase === "focus" ? "Focus" : phase === "break" ? "Pause" : "Pomodoro"}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            >
              ×
            </button>
          </header>

          <div className="mb-4 text-center">
            <p className="font-mono text-6xl tabular-nums">
              {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-linear",
                  phase === "break"
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-accent)]",
                )}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={pauseResume}
              className="flex-1 rounded-md bg-[var(--color-accent)] py-2 text-xs font-mono uppercase tracking-wider text-[var(--color-accent-fg)]"
            >
              {phase === "idle" ? "Start" : "Pause / Resume"}
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-xs font-mono uppercase tracking-wider hover:border-[var(--color-danger)]"
            >
              Stop
            </button>
          </div>

          <div className="mb-3 flex gap-1">
            {(Object.keys(PRESETS) as PresetKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPreset(k)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider",
                  stored.preset === k
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-[var(--color-border-subtle)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]",
                )}
              >
                {PRESETS[k].focus}/{PRESETS[k].break}
              </button>
            ))}
          </div>

          <p className="text-center font-mono text-[10px] text-[var(--color-fg-muted)]">
            {stored.sessionsToday} session{stored.sessionsToday > 1 ? "s" : ""} aujourd&apos;hui
          </p>
        </div>
      )}
    </>
  );
}
