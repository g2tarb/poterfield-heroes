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
  const nextTarget = modules.find((m) => m.status === "active") ?? null;

  return (
    <main className="min-h-svh px-3 pb-12 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Plan général"
        title="25 stations · 8 sections"
        subtitle={`Chaîne complète : ~${totalHours}h. Chaque module a ses compétences avec vidéos FR+EN curées. Tu déverrouilles la suite quand la précédente est validée.`}
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

        {/* Prochaine cible (style Code Noir) */}
        {nextTarget && <NextTargetCard mod={nextTarget} />}

        {/* Skill tree zigzag */}
        <div className="space-y-10">
          {Object.entries(byPhase)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([phase, list]) => (
              <PhaseTree
                key={phase}
                phase={Number(phase)}
                modules={list}
              />
            ))}
        </div>
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

function NextTargetCard({ mod }: { mod: ModuleSummary }) {
  return (
    <Link href={`/modules/${mod.id}`} className="block">
      <article className="ph-panel relative overflow-hidden border-2 border-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] p-4 transition hover:bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)] sm:p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          ► Prochaine cible
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="text-lg font-bold uppercase tracking-wide sm:text-xl">
            M{String(mod.moduleNumber).padStart(2, "0")} · {mod.title}
          </p>
          <span className="ph-ref shrink-0 tabular-nums">{mod.estimatedHours}h</span>
        </div>
        {mod.subtitle && (
          <p className="mt-1 text-sm text-[var(--color-fg-secondary)]">
            {mod.subtitle}
          </p>
        )}
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
          ▶ Commencer
        </p>
      </article>
    </Link>
  );
}

function PhaseTree({
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
      <div className="ph-panel mb-4 flex items-center gap-3 px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
          Section {phaseChar}
        </span>
        <span className="h-3 w-px bg-[var(--color-border-strong)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-secondary)]">
          Phase {phase} · {phaseLabel}
        </span>
      </div>

      <div className="relative">
        {/* Ligne verticale (chemin) */}
        <span
          className="pointer-events-none absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-[var(--color-border-strong)]"
          aria-hidden
        />
        <ol className="space-y-3">
          {modules.map((m, i) => (
            <li
              key={m.id}
              className={`relative flex ${i % 2 === 0 ? "justify-start pr-[10%]" : "justify-end pl-[10%]"}`}
            >
              <ModuleNode mod={m} side={i % 2 === 0 ? "left" : "right"} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ModuleNode({
  mod,
  side,
}: {
  mod: ModuleSummary;
  side: "left" | "right";
}) {
  const isLocked = mod.status === "locked";
  const isActive = mod.status === "active";
  const isDone = mod.status === "completed";

  const borderClass = isDone
    ? "border-[var(--color-success)]"
    : isActive
      ? "border-[var(--color-accent)] shadow-[0_0_18px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
      : "border-[var(--color-border-strong)]";

  const content = (
    <article
      className={`ph-panel relative flex w-full max-w-[88%] items-center gap-3 overflow-hidden border-2 px-3 py-3 transition sm:max-w-[80%] sm:gap-4 sm:px-4 ${borderClass} ${isLocked ? "opacity-55" : "lg:hover:-translate-y-0.5"}`}
    >
      {/* Connecteur vers la ligne centrale */}
      <span
        className={`pointer-events-none absolute top-1/2 hidden h-px w-[10%] bg-[var(--color-border-strong)] sm:block ${
          side === "left" ? "-right-[10%]" : "-left-[10%]"
        }`}
        aria-hidden
      />
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
    <Link href={`/modules/${mod.id}`} className="block w-full">
      {content}
    </Link>
  );
}
