"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const BOOT_LINES = [
  "> porterfield.init()",
  "> [boot] connecting db...",
  "> [boot] hydrating modules...",
  "> [boot] loading coach context...",
  "> [boot] preparing rag retrieval...",
  "> [ok] atelier ready",
];

type Level = {
  id: number;
  name: string;
  icon: string | null;
  xpRequired: number;
};

type Progression = {
  user: { currentXp: number };
  currentLevel: Level | null;
  nextLevel: Level | null;
  xpToNext: number;
  progressPct: number;
};

type Props = {
  /** Plein écran (loading.tsx Next.js) ou inline (skeleton) */
  fullscreen?: boolean;
  /** Texte personnalisé sous le titre (override BOOT_LINES) */
  label?: string;
  /** Taille du titre */
  size?: "sm" | "md" | "lg";
  /** Affiche la jauge de progression XP + palier suivant */
  withProgress?: boolean;
  /** Durée minimum de la jauge animée en ms (défaut 2000) */
  minDurationMs?: number;
};

export function PorterfieldLoader({
  fullscreen = false,
  label,
  size = "md",
  withProgress = false,
  minDurationMs = 2000,
}: Props) {
  const [step, setStep] = useState(0);
  const [progression, setProgression] = useState<Progression | null>(null);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    if (label) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % BOOT_LINES.length);
    }, 420);
    return () => clearInterval(id);
  }, [label]);

  useEffect(() => {
    if (!withProgress) return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiFetch<Progression>("/api/progress/state");
        if (!cancelled) setProgression(data);
      } catch {
        /* silencieux : pas auth ou API down */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [withProgress]);

  useEffect(() => {
    if (!withProgress) return;
    const start = performance.now();
    let raf = 0;
    const target = progression?.progressPct ?? 30;
    const tick = (t: number) => {
      const elapsed = t - start;
      const ratio = Math.min(1, elapsed / minDurationMs);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setAnimPct(target * eased);
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [withProgress, progression, minDurationMs]);

  const titleSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl";

  const inner = (
    <div className="w-full max-w-md px-6 text-center">
      <p
        className={`ph-loader-title font-bold uppercase tracking-tight ${titleSize}`}
        data-text="porterfield"
      >
        porterfield
        <span className="ph-loader-cursor" aria-hidden />
      </p>
      <p className="mt-3 font-mono text-xs text-[var(--color-fg-muted)] sm:text-sm">
        {label ?? BOOT_LINES[step] ?? BOOT_LINES[0]}
      </p>
      {withProgress && (
        <ProgressGauge progression={progression} animatedPct={animPct} />
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-bg-base)]"
        role="status"
        aria-live="polite"
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      className="grid place-items-center py-12 sm:py-16"
      role="status"
      aria-live="polite"
    >
      {inner}
    </div>
  );
}

function ProgressGauge({
  progression,
  animatedPct,
}: {
  progression: Progression | null;
  animatedPct: number;
}) {
  const current = progression?.currentLevel ?? null;
  const next = progression?.nextLevel ?? null;
  const pct = Math.round(animatedPct);

  return (
    <div className="mt-8">
      <div className="flex items-end justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] sm:text-xs">
        <div className="flex max-w-[45%] flex-col items-start text-left">
          <span className="opacity-60">Palier</span>
          <span className="mt-1 flex items-center gap-1.5 text-[var(--color-fg-primary)]">
            {current?.icon && <span aria-hidden>{current.icon}</span>}
            <span className="truncate normal-case tracking-normal">
              {current?.name ?? "Init"}
            </span>
          </span>
        </div>
        <div className="flex max-w-[45%] flex-col items-end text-right">
          <span className="opacity-60">Objectif</span>
          <span className="mt-1 flex items-center gap-1.5 text-[var(--color-accent)]">
            <span className="truncate normal-case tracking-normal">
              {next?.name ?? "—"}
            </span>
            {next?.icon && <span aria-hidden>{next.icon}</span>}
          </span>
        </div>
      </div>
      <div className="relative mt-3 h-2.5 overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)] transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[var(--color-fg-muted)] sm:text-xs">
        <span>{pct}%</span>
        <span>
          {progression?.xpToNext != null
            ? `${progression.xpToNext} XP restants`
            : "..."}
        </span>
      </div>
    </div>
  );
}

/**
 * Version compacte pour les chargements de zones (cards, sidebars).
 * Plus discret qu'un fullscreen loader.
 */
export function PorterfieldSpinner({ label }: { label?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 180);
    return () => clearInterval(id);
  }, []);

  const chars = ["⠋", "⠙", "⠹", "⠸"];

  return (
    <div
      className="flex items-center gap-2 font-mono text-xs text-[var(--color-fg-muted)]"
      role="status"
      aria-live="polite"
    >
      <span className="text-[var(--color-accent)]">{chars[step]}</span>
      <span>{label ?? "porterfield"}</span>
      <span className="ph-loader-cursor h-3" style={{ width: "0.4em" }} aria-hidden />
    </div>
  );
}
