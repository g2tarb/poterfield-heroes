"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type Module = {
  id: string;
  moduleNumber: number;
  phase: number;
  title: string;
  subtitle: string | null;
  estimatedHours: number;
  status: "locked" | "active" | "completed";
};

const PHASE_LABELS: Record<number, string> = {
  1: "Fondamentaux",
  2: "Frontend statique",
  3: "JavaScript",
  4: "Frontend dynamique",
  5: "Backend",
  6: "Bases de données",
  7: "Outillage pro",
  8: "Bonus (3D / IA)",
};

function StationStamp({ status }: { status: Module["status"] }) {
  if (status === "completed") {
    return <span className="ph-stamp ph-stamp-done">✓ Terminé</span>;
  }
  if (status === "active") {
    return <span className="ph-stamp ph-stamp-active">⚡ En cours</span>;
  }
  return <span className="ph-stamp ph-stamp-locked">🔒 Verrouillé</span>;
}

function Station({ mod }: { mod: Module }) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const ref = `STN-${String(mod.moduleNumber).padStart(2, "0")}`;

  const accentBorder = isActive
    ? "border-l-4 border-l-[var(--color-accent)]"
    : isDone
      ? "border-l-4 border-l-[var(--color-success)]"
      : "border-l-4 border-l-[var(--color-border-strong)]";

  const stripeOverlay = isActive ? (
    <div
      className="ph-stripes pointer-events-none absolute inset-0 opacity-50"
      aria-hidden
    />
  ) : null;

  const panel = (
    <article
      className={`ph-panel ph-rivets ph-glitch relative overflow-hidden ${accentBorder} ${isLocked ? "opacity-55" : ""} ${isActive ? "ph-pulse-glow" : ""} transition-transform duration-300 lg:hover:translate-y-[-2px]`}
      data-glitch={isLocked ? undefined : mod.title}
    >
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      {stripeOverlay}

      {/* Header bandeau métal */}
      <header className="ph-station-header relative flex items-center justify-between px-4 py-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
            Station {String(mod.moduleNumber).padStart(2, "0")}
          </span>
          <span className="ph-ref hidden sm:inline">{ref}</span>
        </div>
        <span className="ph-ref tabular-nums">{mod.estimatedHours}h</span>
      </header>

      {/* Body station */}
      <div className="relative px-5 py-5">
        <h3
          className={`text-base font-bold uppercase leading-tight tracking-wide lg:text-lg ${isLocked ? "text-[var(--color-fg-muted)]" : "text-[var(--color-fg-primary)]"}`}
        >
          {mod.title}
        </h3>

        {mod.subtitle && !isLocked && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg-secondary)] line-clamp-2">
            {mod.subtitle}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <StationStamp status={mod.status} />
          {!isLocked && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] transition-opacity lg:opacity-60 lg:group-hover:opacity-100">
              accéder →
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (isLocked) {
    return <div className="group block w-full">{panel}</div>;
  }
  return (
    <Link href={`/modules/${mod.id}`} className="group block w-full">
      {panel}
    </Link>
  );
}

function PhaseSeparator({ phase }: { phase: number }) {
  return (
    <div className="relative my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-[var(--color-border-strong)]" />
      <div className="ph-panel flex items-center gap-2 px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Section {String.fromCharCode(64 + phase)}
        </span>
        <span className="h-3 w-px bg-[var(--color-border-strong)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-secondary)]">
          Phase {phase} · {PHASE_LABELS[phase]}
        </span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--color-border-strong)] to-[var(--color-border-strong)]" />
    </div>
  );
}

export function Staircase({ modules }: { modules: Module[] }) {
  const sorted = [...modules].sort((a, b) => a.moduleNumber - b.moduleNumber);
  const activeRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!activeRef.current) return;
    const t = setTimeout(() => {
      activeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 600);
    return () => clearTimeout(t);
  }, [sorted.length]);

  const items: Array<
    | { kind: "phase-start"; phase: number }
    | { kind: "module"; mod: Module; index: number }
  > = [];
  let lastPhase = -1;
  sorted.forEach((mod, idx) => {
    if (mod.phase !== lastPhase) {
      items.push({ kind: "phase-start", phase: mod.phase });
      lastPhase = mod.phase;
    }
    items.push({ kind: "module", mod, index: idx });
  });

  return (
    <div className="relative">
      {/* En-tête de chaîne */}
      <header className="ph-panel mb-6 flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
            Chaîne d&apos;apprentissage
          </p>
          <p className="mt-0.5 font-mono text-xs text-[var(--color-fg-secondary)]">
            25 stations · 8 sections
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            actif
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
            fait
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />
            verrou
          </span>
        </div>
      </header>

      <ol className="relative flex flex-col gap-3">
        {items.map((item, i) => {
          if (item.kind === "phase-start") {
            return (
              <li key={`phase-${item.phase}-${i}`}>
                <PhaseSeparator phase={item.phase} />
              </li>
            );
          }
          const delayMs = Math.min(item.index, 12) * 35;
          const isActive = item.mod.status === "active";
          return (
            <li
              key={item.mod.id}
              ref={isActive ? activeRef : undefined}
              className="ph-fade-up scroll-mt-24"
              style={{ animationDelay: `${delayMs}ms` }}
            >
              <Station mod={item.mod} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
