import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

type ModuleSummary = {
  id: string;
  moduleNumber: number;
  phase: number;
  title: string;
  subtitle: string | null;
  estimatedHours: number;
  status: "locked" | "active" | "completed";
};

async function getModules(): Promise<ModuleSummary[]> {
  try {
    return await apiFetch<ModuleSummary[]>("/api/modules");
  } catch {
    return [];
  }
}

const PHASE_LABELS: Record<number, string> = {
  1: "Fondamentaux",
  2: "Frontend statique",
  3: "JavaScript",
  4: "Frontend dynamique",
  5: "Backend",
  6: "Bases de données",
  7: "Outillage pro & prod",
  8: "Bonus (3D, Python, IA)",
};

export const metadata = { title: "Roadmap" };

export default async function RoadmapPage() {
  const modules = await getModules();
  const byPhase = modules.reduce<Record<number, ModuleSummary[]>>(
    (acc, m) => {
      (acc[m.phase] ??= []).push(m);
      return acc;
    },
    {},
  );

  const totalHours = modules.reduce((s, m) => s + m.estimatedHours, 0);
  const completed = modules.filter((m) => m.status === "completed").length;

  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Plan général"
        title="25 stations · 8 sections"
        subtitle={`Chaîne complète : ~${totalHours}h. Chaque station se déverrouille quand la précédente est terminée. Pas de raccourci, pas de skip.`}
        refCode="ROADMAP"
      />

      <div className="mx-auto max-w-3xl space-y-8">
        {/* Compteur global */}
        <section className="ph-panel ph-rivets relative grid grid-cols-3 gap-0 overflow-hidden">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <GaugeCell label="Faites" value={completed} sub={`/${modules.length}`} />
          <GaugeCell
            label="Progress"
            value={Math.round((completed / Math.max(1, modules.length)) * 100)}
            sub="%"
          />
          <GaugeCell label="Total" value={totalHours} sub="h" />
        </section>

        {Object.entries(byPhase)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([phase, list]) => (
            <PhaseSection
              key={phase}
              phase={Number(phase)}
              modules={list}
            />
          ))}
      </div>
    </main>
  );
}

function GaugeCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="border-r border-[var(--color-border-subtle)] px-4 py-4 last:border-r-0 sm:px-5 sm:py-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">
        {value}
        <span className="ml-0.5 text-xs font-normal text-[var(--color-fg-muted)]">
          {sub}
        </span>
      </p>
    </div>
  );
}

function PhaseSection({
  phase,
  modules,
}: {
  phase: number;
  modules: ModuleSummary[];
}) {
  const phaseLabel = PHASE_LABELS[phase];
  const phaseChar = String.fromCharCode(64 + phase);

  return (
    <section>
      <div className="ph-panel mb-3 flex items-center gap-3 px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
          Section {phaseChar}
        </span>
        <span className="h-3 w-px bg-[var(--color-border-strong)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-secondary)]">
          Phase {phase} · {phaseLabel}
        </span>
      </div>

      <ol className="space-y-2">
        {modules.map((m) => (
          <li key={m.id}>
            <ModuleRow mod={m} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function ModuleRow({ mod }: { mod: ModuleSummary }) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const accentClass = isActive
    ? "border-l-4 border-l-[var(--color-accent)]"
    : isDone
      ? "border-l-4 border-l-[var(--color-success)]"
      : "border-l-4 border-l-[var(--color-border-strong)]";

  const content = (
    <article
      className={`ph-panel relative flex items-center gap-3 overflow-hidden px-3 py-3 transition sm:gap-4 sm:px-4 ${accentClass} ${isLocked ? "opacity-55" : "lg:hover:translate-y-[-1px]"}`}
    >
      {isActive && (
        <div
          className="ph-stripes pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
        />
      )}
      <span className="ph-ref shrink-0 tabular-nums">
        M{String(mod.moduleNumber).padStart(2, "0")}
      </span>
      <div className="relative min-w-0 flex-1">
        <p
          className={`truncate text-sm font-bold uppercase tracking-wide sm:text-base ${isLocked ? "text-[var(--color-fg-muted)]" : ""}`}
        >
          {mod.title}
        </p>
        {mod.subtitle && !isLocked && (
          <p className="mt-0.5 truncate text-xs text-[var(--color-fg-secondary)]">
            {mod.subtitle}
          </p>
        )}
      </div>
      <span className="ph-ref shrink-0 tabular-nums">{mod.estimatedHours}h</span>
      <div className="relative shrink-0">
        {isDone && <span className="ph-stamp ph-stamp-done">✓</span>}
        {isActive && <span className="ph-stamp ph-stamp-active">⚡</span>}
        {isLocked && <span className="ph-stamp ph-stamp-locked">🔒</span>}
      </div>
    </article>
  );

  if (isLocked) return content;
  return (
    <Link href={`/modules/${mod.id}`} className="block">
      {content}
    </Link>
  );
}
