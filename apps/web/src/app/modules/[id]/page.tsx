import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { CoachPanel } from "@/components/coach/CoachPanel";

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
    estimatedMinutes: number | null;
    displayOrder: number;
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

function exerciseKindLabel(kind: ModuleDetail["exercises"][number]["kind"]) {
  return {
    quiz_activation: "Quiz d'activation",
    quiz_verification: "Quiz de vérification",
    code_exercise: "Exercice code",
    project_validation: "Projet de validation",
  }[kind];
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getModule(id);
  if (!data) notFound();

  const { module: mod, skills, videos, exercises } = data;
  const primaryVideo = videos.find((v) => v.isPrimary === 1);
  const additionalVideos = videos.filter((v) => v.isPrimary === 0);

  return (
    <>
    <main className="min-h-svh px-6 py-12 md:px-12 lg:px-24">
      <nav className="mb-8 font-mono text-xs">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Tous les modules
        </Link>
      </nav>

      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
          M{String(mod.moduleNumber).padStart(2, "0")} · Phase {mod.phase} ·{" "}
          {mod.estimatedHours}h
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
          {mod.title}
        </h1>
        {mod.subtitle && (
          <p className="mt-3 text-xl text-[var(--color-fg-secondary)]">
            {mod.subtitle}
          </p>
        )}
      </header>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Pourquoi ce module
        </h2>
        <p className="whitespace-pre-line text-base leading-relaxed text-[var(--color-fg-primary)]">
          {mod.pourquoi}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Compétences à valider ({skills.length})
        </h2>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {skills.map((s, i) => (
            <li
              key={s.id}
              className="flex gap-3 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3"
            >
              <span className="shrink-0 font-mono text-xs text-[var(--color-fg-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {primaryVideo && (
        <section className="mb-12">
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            Vidéo principale
          </h2>
          <h3 className="mb-1 text-2xl font-semibold">{primaryVideo.title}</h3>
          {primaryVideo.creator && (
            <p className="mb-4 text-sm text-[var(--color-fg-secondary)]">
              {primaryVideo.creator}{" "}
              {primaryVideo.durationSeconds && (
                <span className="font-mono text-[var(--color-fg-muted)]">
                  · {formatDuration(primaryVideo.durationSeconds)}
                </span>
              )}
            </p>
          )}
          {primaryVideo.youtubeId && (
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${primaryVideo.youtubeId}`}
                title={primaryVideo.title}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
          {primaryVideo.whyThisOne && (
            <p className="mt-4 max-w-3xl text-sm italic text-[var(--color-fg-secondary)]">
              {primaryVideo.whyThisOne}
            </p>
          )}
        </section>
      )}

      {additionalVideos.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Vidéos d&apos;approfondissement
          </h2>
          <ul className="space-y-3">
            {additionalVideos.map((v) => (
              <li
                key={v.id}
                className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{v.title}</h3>
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
              </li>
            ))}
          </ul>
        </section>
      )}

      {exercises.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Étapes du module ({exercises.length})
          </h2>
          <ol className="space-y-3">
            {exercises.map((e, i) => (
              <li
                key={e.id}
                className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                    Étape {i + 1} · {exerciseKindLabel(e.kind)}
                    {e.estimatedMinutes && (
                      <span> · ~{e.estimatedMinutes} min</span>
                    )}
                  </p>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-fg-secondary)]">
                  {e.statement.split("\n").slice(0, 3).join("\n")}
                  {e.statement.split("\n").length > 3 && "…"}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
    <CoachPanel moduleId={mod.id} />
    </>
  );
}
