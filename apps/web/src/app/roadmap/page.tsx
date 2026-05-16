import { apiFetch } from "@/lib/api";
import Link from "next/link";

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

  return (
    <main className="min-h-svh px-4 pb-8 pt-4 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
        <nav className="mb-8 font-mono text-xs">
          <Link
            href="/"
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
          >
            ← Accueil
          </Link>
        </nav>

        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            Roadmap
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            25 modules · 8 phases · ~1500h
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Vue d&apos;ensemble linéaire. Chaque module est verrouillé tant que
            le précédent n&apos;est pas validé.
          </p>
        </header>

        <div className="mx-auto max-w-3xl space-y-12">
          {Object.entries(byPhase)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([phase, list]) => (
              <section key={phase}>
                <h2 className="mb-4 flex items-baseline gap-3 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                  <span>Phase {phase}</span>
                  <span className="text-[var(--color-fg-secondary)] normal-case tracking-normal">
                    {PHASE_LABELS[Number(phase)]}
                  </span>
                </h2>
                <ol className="space-y-2">
                  {list.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/modules/${m.id}`}
                        className={
                          m.status === "active"
                            ? "flex items-baseline gap-4 rounded-md border border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-4 py-3 transition hover:bg-[var(--color-bg-high)]"
                            : m.status === "completed"
                              ? "flex items-baseline gap-4 rounded-md border border-[var(--color-success)] bg-[var(--color-bg-elevated)] px-4 py-3 transition hover:bg-[var(--color-bg-high)]"
                              : "flex items-baseline gap-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-4 py-3 transition hover:border-[var(--color-border-strong)]"
                        }
                      >
                        <span className="shrink-0 font-mono text-xs text-[var(--color-fg-muted)] tabular-nums">
                          M{String(m.moduleNumber).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span className="text-sm font-semibold">{m.title}</span>
                          {m.subtitle && (
                            <span className="ml-2 text-xs text-[var(--color-fg-muted)]">
                              · {m.subtitle}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                          {m.estimatedHours}h
                        </span>
                        <span
                          className={
                            m.status === "completed"
                              ? "shrink-0 text-xs text-[var(--color-success)]"
                              : m.status === "active"
                                ? "shrink-0 text-xs text-[var(--color-accent)]"
                                : "shrink-0 text-xs text-[var(--color-fg-muted)]"
                          }
                        >
                          {m.status === "completed"
                            ? "✓"
                            : m.status === "active"
                              ? "▶"
                              : "·"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
        </div>
    </main>
  );
}
