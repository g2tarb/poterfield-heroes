"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useFocusedModule } from "../ambient/FocusedModuleContext";

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
  1: "Réseau & protocoles",
  2: "Shell & systèmes",
  3: "C & bas niveau",
  4: "Python offensif",
  9: "Algorithmie",
};

const PHASE_ICONS: Record<number, string> = {
  1: "◉",
  2: "⬡",
  3: "▸",
  4: "⌬",
  9: "∑",
};

// Pattern zigzag basé sur cosinus : positions [0..4] sur 5 lanes,
// amplitude ~ ±28% autour de l'axe central.
function laneFor(index: number): number {
  const wave = Math.cos((index * Math.PI) / 3);
  return Math.round(2 + wave * 2);
}

function Rivet({
  pos,
}: {
  pos: "t" | "b" | "l" | "r";
}) {
  const cls =
    pos === "t"
      ? "top-0.5 left-1/2 -translate-x-1/2"
      : pos === "b"
        ? "bottom-0.5 left-1/2 -translate-x-1/2"
        : pos === "l"
          ? "left-0.5 top-1/2 -translate-y-1/2"
          : "right-0.5 top-1/2 -translate-y-1/2";
  return (
    <span
      aria-hidden
      className={`absolute h-1.5 w-1.5 rounded-full ${cls}`}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, var(--color-fg-muted) 0%, var(--color-bg-base) 70%)",
        boxShadow: "inset 0 0 0 1px var(--color-border-strong)",
      }}
    />
  );
}

function NodeCircle({ mod }: { mod: Module }) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const borderColor = isActive
    ? "border-[var(--color-accent)]"
    : isDone
      ? "border-[var(--color-success)]"
      : "border-[var(--color-border-strong)]";

  const glyph = isDone ? "✓" : isActive ? "⚡" : isLocked ? "🔒" : (PHASE_ICONS[mod.phase] ?? "·");

  const content = (
    <div className={`group inline-block ${isLocked ? "opacity-55" : ""}`}>
      {/* Wrapper du cercle (taille fixe) — l'orbite SVG est positionnée par rapport à LUI, pas au parent */}
      <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
        {/* Orbite de code autour du module actif (déborde de 20px de chaque côté) */}
        {isActive && (
          <svg
            aria-hidden
            viewBox="0 0 144 144"
            preserveAspectRatio="xMidYMid meet"
            className="ph-orbit-spin pointer-events-none absolute -inset-5 z-0"
          >
            <defs>
              <path
                id={`orbit-${mod.id}`}
                d="M 72,72 m -64,0 a 64,64 0 1,1 128,0 a 64,64 0 1,1 -128,0"
                fill="none"
              />
            </defs>
            <text
              className="fill-[var(--color-accent)]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8.5px",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              <textPath href={`#orbit-${mod.id}`} startOffset="0">
                {`⚡ active · const skill = next() · await mastery() · if (done) break · // M${String(mod.moduleNumber).padStart(2, "0")} · console.log("⚙") · return level + 1 · `}
              </textPath>
            </text>
          </svg>
        )}

        {/* Cercle station */}
        <div
          className={`relative grid h-full w-full place-items-center rounded-full border-[3px] ${borderColor} ${isActive ? "ph-pulse-glow" : ""} transition-transform duration-300 ${isLocked ? "" : "group-hover:-translate-y-1 group-hover:scale-105"}`}
        style={{
          background: `linear-gradient(180deg, color-mix(in oklch, var(--color-bg-elevated), white 4%) 0%, var(--color-bg-elevated) 50%, color-mix(in oklch, var(--color-bg-elevated), black 6%) 100%)`,
          boxShadow: isActive
            ? `inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.55), 0 6px 18px color-mix(in oklch, var(--color-accent), transparent 50%)`
            : `inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -2px 0 rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.35)`,
        }}
      >
        {/* hachures atelier sur actif */}
        {isActive && (
          <div
            className="ph-stripes pointer-events-none absolute inset-0 rounded-full opacity-30"
            aria-hidden
          />
        )}

        <Rivet pos="t" />
        <Rivet pos="b" />
        <Rivet pos="l" />
        <Rivet pos="r" />

          <div className="relative flex flex-col items-center">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-fg-muted)]">
              M{String(mod.moduleNumber).padStart(2, "0")}
            </span>
            <span
              className={`mt-0.5 text-3xl ${isLocked ? "opacity-50 grayscale" : ""}`}
              aria-hidden
            >
              {glyph}
            </span>
          </div>
        </div>
      </div>

      {/* Titre + durée */}
      <p
        className={`mt-3 mx-auto max-w-[140px] text-center text-[11px] font-bold uppercase leading-tight tracking-wide sm:max-w-[160px] sm:text-xs ${isLocked ? "text-[var(--color-fg-muted)]" : ""}`}
      >
        {mod.title}
      </p>
      <p className="text-center font-mono text-[10px] tracking-wider text-[var(--color-fg-muted)]">
        {mod.estimatedHours}h
      </p>
    </div>
  );

  if (isLocked) return content;

  return (
    <Link
      href={`/modules/${mod.id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-full"
    >
      {content}
    </Link>
  );
}

function TransversalCard({ mod }: { mod: Module }) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const borderClass = isDone
    ? "border-l-[var(--color-success)]"
    : isActive
      ? "border-l-[var(--color-success)]"
      : "border-l-[var(--color-border-strong)]";

  const content = (
    <article
      className={`ph-panel ph-rivets relative overflow-hidden border-l-4 ${borderClass} ${isActive ? "ph-pulse-glow" : ""} ${isLocked ? "opacity-55" : "transition-transform duration-300 lg:hover:-translate-y-0.5"}`}
    >
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />

      <header className="ph-station-header flex items-center justify-between px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-success)]">
          🎯 M{String(mod.moduleNumber).padStart(2, "0")} · transversal
        </span>
        <span className="ph-ref tabular-nums">{mod.estimatedHours}h cumul</span>
      </header>

      <div className="relative px-5 py-4">
        <h3 className="text-lg font-bold uppercase leading-tight tracking-wide sm:text-xl">
          {mod.title}
        </h3>
        {mod.subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-secondary)]">
            {mod.subtitle}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            En parallèle · 1 skill/sem min
          </span>
          {!isLocked && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-success)]">
              {isDone ? "✓ Validé" : "▶ Accès libre"}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (isLocked) return content;
  return (
    <Link
      href={`/modules/${mod.id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]"
    >
      {content}
    </Link>
  );
}

function PhaseSeparator({ phase }: { phase: number }) {
  return (
    <div className="relative my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-[var(--color-border-strong)]" />
      <div className="ph-panel flex items-center gap-2 px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Section {String.fromCharCode(64 + phase)}
        </span>
        <span className="h-3 w-px bg-[var(--color-border-strong)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-secondary)]">
          Phase {phase} · {PHASE_LABELS[phase] ?? ""}
        </span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--color-border-strong)] to-[var(--color-border-strong)]" />
    </div>
  );
}

export function LearningPath({ modules }: { modules: Module[] }) {
  // Séparation : modules transversaux (phase ≥ 9, hors chaîne) vs path linéaire
  const transversal = modules
    .filter((m) => m.phase >= 9)
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
  const path = modules
    .filter((m) => m.phase < 9)
    .sort((a, b) => a.moduleNumber - b.moduleNumber);

  const activeRef = useRef<HTMLLIElement | null>(null);
  const { setHovered } = useFocusedModule();

  useEffect(() => {
    if (!activeRef.current) return;
    const t = setTimeout(() => {
      activeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 700);
    return () => clearTimeout(t);
  }, [path.length]);

  const items: Array<
    | { kind: "phase"; phase: number; key: string }
    | { kind: "module"; mod: Module; index: number; key: string }
  > = [];
  let lastPhase = -1;
  path.forEach((mod, idx) => {
    if (mod.phase !== lastPhase) {
      items.push({ kind: "phase", phase: mod.phase, key: `p-${mod.phase}` });
      lastPhase = mod.phase;
    }
    items.push({ kind: "module", mod, index: idx, key: mod.id });
  });

  return (
    <div className="relative">
      {/* Section TRANSVERSAUX (modules hors chaîne, accès libre) */}
      {transversal.length > 0 && (
        <section className="mb-8">
          <header className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-success)]">
              🎯 Transversal · accès libre
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              En parallèle de la chaîne
            </p>
          </header>
          <div className="grid grid-cols-1 gap-3">
            {transversal.map((mod) => (
              <TransversalCard key={mod.id} mod={mod} />
            ))}
          </div>
        </section>
      )}

      <header className="ph-panel mb-6 flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
            Chaîne d&apos;apprentissage
          </p>
          <p className="mt-0.5 font-mono text-xs text-[var(--color-fg-secondary)]">
            {path.length} stations · 8 sections
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
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />
            verrou
          </span>
        </div>
      </header>

      <ol className="relative flex flex-col gap-6 pb-8 sm:gap-8">
        {items.map((item) => {
          if (item.kind === "phase") {
            return (
              <li key={item.key}>
                <PhaseSeparator phase={item.phase} />
              </li>
            );
          }
          const isActive = item.mod.status === "active";
          const lane = laneFor(item.index);
          const offsetPct = (lane - 2) * 14;
          const delayMs = Math.min(item.index, 14) * 50;

          return (
            <li
              key={item.key}
              ref={isActive ? activeRef : undefined}
              className="ph-fade-up flex scroll-mt-32 justify-center"
              style={{ animationDelay: `${delayMs}ms` }}
              onMouseEnter={() => setHovered(item.mod.moduleNumber)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{ transform: `translateX(${offsetPct}%)` }}
                className="will-change-transform"
              >
                <NodeCircle mod={item.mod} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function LearningPathSkeleton() {
  return (
    <div className="relative">
      <header className="ph-panel mb-6 flex items-center justify-between px-4 py-3">
        <div className="space-y-1">
          <div className="h-2 w-32 rounded-sm bg-[var(--color-border-subtle)]" />
          <div className="h-3 w-44 rounded-sm bg-[var(--color-bg-high)]" />
        </div>
        <div className="flex gap-3">
          <div className="h-2 w-12 rounded-sm bg-[var(--color-bg-high)]" />
          <div className="h-2 w-12 rounded-sm bg-[var(--color-bg-high)]" />
        </div>
      </header>
      <ol className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => {
          const offset = ((i % 5) - 2) * 14;
          return (
            <li key={i} className="flex justify-center">
              <div style={{ transform: `translateX(${offset}%)` }}>
                <div className="h-24 w-24 animate-pulse rounded-full border-[3px] border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:h-28 sm:w-28" />
                <div className="mx-auto mt-3 h-2 w-20 animate-pulse rounded-sm bg-[var(--color-bg-high)]" />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
