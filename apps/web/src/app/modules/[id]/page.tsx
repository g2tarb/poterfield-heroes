import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { ModuleStartButton } from "@/components/module/ModuleStartButton";
import { ExerciseRunner } from "@/components/module/ExerciseRunner";

type ModuleDetail = {
  module: {
    id: string;
    moduleNumber: number;
    phase: number;
    title: string;
    subtitle: string | null;
    pourquoi: string;
    objectives: string[];
    prerequisites: string | null;
    estimatedHours: number;
    estimatedWeeks: number | null;
  };
  skills: Array<{
    id: string;
    slug: string;
    label: string;
    weight: number;
    displayOrder: number;
  }>;
  videos: Array<{
    id: string;
    isPrimary: number;
    title: string;
    creator: string | null;
    youtubeId: string | null;
    durationSeconds: number | null;
    whyThisOne: string | null;
    displayOrder: number;
  }>;
  exercises: Array<{
    id: string;
    kind:
      | "quiz_activation"
      | "quiz_verification"
      | "code_exercise"
      | "project_validation";
    title: string;
    statement: string;
    starterCode: string | null;
    language: string | null;
    quizQuestions: Array<{
      question: string;
      options?: string[];
      correctIndex?: number;
      correctText?: string;
      explanation: string;
    }> | null;
    estimatedMinutes: number | null;
    displayOrder: number;
    passThresholdPct: number;
  }>;
  progress: {
    status: "locked" | "active" | "completed";
    secondsSpent: number;
  } | null;
};

async function getModule(id: string): Promise<ModuleDetail | null> {
  try {
    return await apiFetch<ModuleDetail>(`/api/modules/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

function formatDuration(seconds: number | null): string | null {
  if (seconds == null) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m}min`;
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getModule(id);
  if (!data) notFound();

  const { module: mod, skills, videos, exercises, progress } = data;
  const primaryVideo = videos.find((v) => v.isPrimary === 1);
  const additionalVideos = videos.filter((v) => v.isPrimary === 0);
  const status = progress?.status ?? "locked";

  return (
    <main className="min-h-svh px-4 pb-8 pt-4 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <nav className="mb-6 font-mono text-xs">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Atelier
        </Link>
      </nav>

      {/* Layout 2 colonnes desktop, 1 col mobile */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        {/* === COLONNE PRINCIPALE === */}
        <article className="min-w-0 space-y-12">
          <header>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              M{String(mod.moduleNumber).padStart(2, "0")} · Phase {mod.phase}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
              {mod.title}
            </h1>
            {mod.subtitle && (
              <p className="mt-4 text-lg text-[var(--color-fg-secondary)] lg:hidden">
                {mod.subtitle}
              </p>
            )}
          </header>

          {/* Pourquoi */}
          <section>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              Pourquoi
            </h2>
            <blockquote className="border-l-2 border-[var(--color-accent)] pl-4">
              <p className="whitespace-pre-line text-base leading-relaxed">
                {mod.pourquoi}
              </p>
            </blockquote>
          </section>

          {/* Vidéo principale */}
          {primaryVideo && (
            <section>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                Vidéo principale · {primaryVideo.creator}
                {primaryVideo.durationSeconds && (
                  <span> · {formatDuration(primaryVideo.durationSeconds)}</span>
                )}
              </h2>
              <h3 className="mb-3 text-xl font-semibold">{primaryVideo.title}</h3>
              {primaryVideo.youtubeId && (
                <>
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${primaryVideo.youtubeId}`}
                      title={primaryVideo.title}
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${primaryVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
                  >
                    Ouvrir sur YouTube ↗
                  </a>
                </>
              )}
              {primaryVideo.whyThisOne && (
                <p className="mt-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3 text-sm italic text-[var(--color-fg-secondary)]">
                  💡 {primaryVideo.whyThisOne}
                </p>
              )}
            </section>
          )}

          {/* Vidéos approfondissement */}
          {additionalVideos.length > 0 && (
            <section>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                Pour approfondir
              </h2>
              <ul className="space-y-3">
                {additionalVideos.map((v) => {
                  const href = v.youtubeId
                    ? `https://www.youtube.com/watch?v=${v.youtubeId}`
                    : null;
                  const Inner = (
                    <>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold">
                          {v.title}
                          {href && (
                            <span className="ml-2 font-mono text-xs font-normal text-[var(--color-accent)]">
                              ↗
                            </span>
                          )}
                        </h3>
                        {v.durationSeconds && (
                          <span className="shrink-0 font-mono text-xs text-[var(--color-fg-muted)]">
                            {formatDuration(v.durationSeconds)}
                          </span>
                        )}
                      </div>
                      {v.creator && (
                        <p className="mt-1 text-sm text-[var(--color-fg-secondary)]">
                          {v.creator}
                        </p>
                      )}
                      {v.whyThisOne && (
                        <p className="mt-2 text-sm italic text-[var(--color-fg-secondary)]">
                          {v.whyThisOne}
                        </p>
                      )}
                    </>
                  );
                  return (
                    <li key={v.id}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-high)]"
                        >
                          {Inner}
                        </a>
                      ) : (
                        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
                          {Inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Étapes */}
          {exercises.length > 0 && (
            <section>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                Étapes du parcours ({exercises.length})
              </h2>
              <ol className="space-y-3">
                {exercises.map((e, i) => (
                  <li key={e.id}>
                    <ExerciseRunner
                      exerciseId={e.id}
                      kind={e.kind}
                      title={e.title}
                      statement={e.statement}
                      starterCode={e.starterCode}
                      language={e.language}
                      quizQuestions={e.quizQuestions}
                      estimatedMinutes={e.estimatedMinutes}
                      passThresholdPct={e.passThresholdPct}
                      index={i}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        {/* === COLONNE LATÉRALE (desktop sticky) === */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          {/* CTA */}
          <ModuleStartButton moduleId={mod.id} initialStatus={status} />

          {/* Méta */}
          <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Informations
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-fg-muted)]">Durée</dt>
                <dd className="font-mono tabular-nums">
                  {mod.estimatedHours}h
                  {mod.estimatedWeeks && (
                    <span className="text-[var(--color-fg-muted)]">
                      {" "}
                      · ~{mod.estimatedWeeks}sem
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-fg-muted)]">Phase</dt>
                <dd className="font-mono tabular-nums">{mod.phase} / 8</dd>
              </div>
              {mod.prerequisites && (
                <div>
                  <dt className="text-[var(--color-fg-muted)]">Prérequis</dt>
                  <dd className="mt-1 text-xs text-[var(--color-fg-secondary)]">
                    {mod.prerequisites}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Objectifs */}
          {mod.objectives.length > 0 && (
            <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                Tu sauras ({mod.objectives.length})
              </h3>
              <ul className="space-y-2 text-xs">
                {mod.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-2 leading-snug">
                    <span
                      className="shrink-0 text-[var(--color-accent)]"
                      aria-hidden
                    >
                      ◇
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                Compétences à valider ({skills.length})
              </h3>
              <ul className="space-y-1.5 text-xs">
                {skills.map((s, i) => (
                  <li key={s.id} className="flex gap-2 leading-snug">
                    <span className="shrink-0 font-mono tabular-nums text-[var(--color-fg-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
