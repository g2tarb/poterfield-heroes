"use client";

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

function StepCard({ mod }: { mod: Module }) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const borderClass = isActive
    ? "border-[var(--color-accent)] shadow-[0_0_24px_-8px_var(--color-accent)]"
    : isDone
      ? "border-[var(--color-success)]"
      : "border-[var(--color-border-subtle)]";

  const opacityClass = isLocked ? "opacity-60" : "";

  const card = (
    <div
      className={`group w-full max-w-md rounded-2xl border-2 bg-[var(--color-bg-elevated)] p-5 transition active:scale-[0.98] lg:hover:scale-[1.02] ${borderClass} ${opacityClass}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          M{String(mod.moduleNumber).padStart(2, "0")} · Phase {mod.phase}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-[var(--color-fg-muted)]">
          {mod.estimatedHours}h
        </span>
      </div>

      <h3
        className={`mt-2 text-base font-semibold leading-snug lg:text-lg ${isLocked ? "text-[var(--color-fg-muted)]" : "text-[var(--color-fg-primary)]"}`}
      >
        {mod.title}
      </h3>

      {mod.subtitle && !isLocked && (
        <p className="mt-1.5 text-xs leading-snug text-[var(--color-fg-secondary)] line-clamp-2">
          {mod.subtitle}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`font-mono text-[10px] uppercase tracking-wider ${
            isActive
              ? "text-[var(--color-accent)]"
              : isDone
                ? "text-[var(--color-success)]"
                : "text-[var(--color-fg-muted)]"
          }`}
        >
          {isActive
            ? "▶ en cours"
            : isDone
              ? "✓ validé"
              : "🔒 verrouillé"}
        </span>
        {!isLocked && (
          <span className="font-mono text-[10px] text-[var(--color-fg-muted)] transition lg:opacity-0 lg:group-hover:opacity-100">
            →
          </span>
        )}
      </div>
    </div>
  );

  if (isLocked) return card;
  return (
    <Link href={`/modules/${mod.id}`} className="block w-full max-w-md">
      {card}
    </Link>
  );
}

export function Staircase({ modules }: { modules: Module[] }) {
  const sorted = [...modules].sort(
    (a, b) => a.moduleNumber - b.moduleNumber,
  );

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
      {/* Épine dorsale verticale — uniquement desktop */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-border-strong)] via-[var(--color-border-subtle)] to-transparent lg:block"
        aria-hidden
      />

      <ol className="relative flex flex-col gap-4 lg:gap-8">
        {items.map((item, i) => {
          if (item.kind === "phase-start") {
            return (
              <li
                key={`phase-${item.phase}-${i}`}
                className="relative my-2 flex items-center justify-center"
              >
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  Phase {item.phase} · {PHASE_LABELS[item.phase]}
                </span>
              </li>
            );
          }
          // Mobile = toujours centré. Desktop = zigzag.
          const desktopAlign =
            item.index % 2 === 0 ? "lg:justify-start" : "lg:justify-end";
          return (
            <li
              key={item.mod.id}
              className={`relative flex justify-center ${desktopAlign}`}
            >
              {/* Connecteur ligne-vers-carte (desktop only) */}
              <div
                className={`pointer-events-none absolute top-1/2 hidden h-px w-[8%] bg-[var(--color-border-subtle)] lg:block ${
                  item.index % 2 === 0 ? "left-[42%]" : "right-[42%]"
                }`}
                aria-hidden
              />
              <StepCard mod={item.mod} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
