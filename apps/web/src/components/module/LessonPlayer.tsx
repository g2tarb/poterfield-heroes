"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { burstSuccess, burstXp } from "@/lib/feedback";
import { ExerciseRunner } from "./ExerciseRunner";
import { LazySandbox } from "@/components/sandbox/LazySandbox";
import { Markdown } from "@/components/coach/Markdown";
import { YoutubePlayer, type YoutubePlayerHandle } from "./YoutubePlayer";
import { VideoNotesPanel } from "./VideoNotesPanel";

type Video = {
  id: string;
  isPrimary: number;
  title: string;
  creator: string | null;
  youtubeId: string | null;
  durationSeconds: number | null;
  whyThisOne: string | null;
  displayOrder: number;
};

type SkillVideo = {
  youtubeId: string;
  title?: string;
  channel?: string;
  lang: "fr" | "en";
};

type ExternalResource = {
  id: string;
  kind: string;
  provider: string;
  title: string;
  url: string;
  language: string;
  level: string;
  whyThisOne: string | null;
  estimatedMinutes: number | null;
  lastVerifiedAt: string | Date | null;
  httpStatus: number | null;
};

type Skill = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  weight: number;
  displayOrder: number;
  videos: SkillVideo[];
  prereqSkillSlugs: string[];
  contentMarkdown: string | null;
  resources: ExternalResource[];
  status: "discovering" | "practicing" | "mastered" | null;
  masteryPct: number | null;
};

type Exercise = {
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
};

type ModuleInfo = {
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

type ModuleData = {
  module: ModuleInfo;
  skills: Skill[];
  videos: Video[];
  exercises: Exercise[];
  progress: { status: "locked" | "active" | "completed"; secondsSpent: number } | null;
};

type Step =
  | { kind: "intro" }
  | { kind: "video"; video: Video }
  | { kind: "skill"; skill: Skill }
  | { kind: "exercise"; exercise: Exercise }
  | { kind: "extras"; videos: Video[] }
  | { kind: "recap" };

const ENCOURAGE = [
  "Allez !",
  "Tu progresses !",
  "On continue !",
  "Solide !",
  "Encore une étape !",
  "Tu chauffes !",
  "Focus !",
];

const STEP_KIND_LABELS: Record<Step["kind"], { label: string; icon: string }> = {
  intro: { label: "Intro", icon: "◐" },
  video: { label: "Vidéo", icon: "▶" },
  skill: { label: "Compétence", icon: "◆" },
  exercise: { label: "Exercice", icon: "⚙" },
  extras: { label: "Pour aller plus loin", icon: "↗" },
  recap: { label: "Récap", icon: "✓" },
};

function buildSteps(data: ModuleData): Step[] {
  const steps: Step[] = [{ kind: "intro" }];
  const primary = data.videos.find((v) => v.isPrimary === 1);
  if (primary) steps.push({ kind: "video", video: primary });

  data.skills
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .forEach((skill) => steps.push({ kind: "skill", skill }));

  data.exercises
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .forEach((exercise) => steps.push({ kind: "exercise", exercise }));

  const extras = data.videos.filter((v) => v.isPrimary === 0);
  if (extras.length > 0) steps.push({ kind: "extras", videos: extras });

  steps.push({ kind: "recap" });
  return steps;
}

function lsKey(moduleId: string) {
  return `ph_lesson_step_${moduleId}`;
}

export function LessonPlayer({ data }: { data: ModuleData }) {
  const steps = useMemo(() => buildSteps(data), [data]);
  const total = steps.length;
  const [stepIndex, setStepIndex] = useState(0);

  // Restaure le step depuis localStorage
  useEffect(() => {
    const stored = Number(
      localStorage.getItem(lsKey(data.module.id)) ?? "0",
    );
    if (Number.isFinite(stored) && stored >= 0 && stored < total) {
      setStepIndex(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.module.id, total]);

  useEffect(() => {
    localStorage.setItem(lsKey(data.module.id), String(stepIndex));
  }, [stepIndex, data.module.id]);

  const current = steps[stepIndex]!;
  const progressPct = ((stepIndex + 1) / total) * 100;

  function next() {
    setStepIndex((i) => Math.min(total - 1, i + 1));
  }
  function prev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="flex flex-col gap-4">
      <LessonProgressHeader
        stepIndex={stepIndex}
        total={total}
        progressPct={progressPct}
        kind={current.kind}
        moduleTitle={data.module.title}
      />

      {/* Step content avec animation à chaque changement */}
      <div
        key={stepIndex}
        className="ph-fade-up min-h-[420px]"
        style={{ animationDelay: "0ms" }}
      >
        {current.kind === "intro" && <StepIntro module={data.module} />}
        {current.kind === "video" && (
          <StepVideo video={current.video} moduleId={data.module.id} />
        )}
        {current.kind === "skill" && (
          <StepSkill
            skill={current.skill}
            allSkills={data.skills}
            moduleNumber={data.module.moduleNumber}
          />
        )}
        {current.kind === "exercise" && (
          <StepExercise exercise={current.exercise} index={stepIndex} />
        )}
        {current.kind === "extras" && <StepExtras videos={current.videos} />}
        {current.kind === "recap" && (
          <StepRecap
            module={data.module}
            skills={data.skills}
            status={data.progress?.status ?? "active"}
          />
        )}
      </div>

      <LessonNav
        stepIndex={stepIndex}
        total={total}
        prev={prev}
        next={next}
      />
    </div>
  );
}

function LessonProgressHeader({
  stepIndex,
  total,
  progressPct,
  kind,
  moduleTitle,
}: {
  stepIndex: number;
  total: number;
  progressPct: number;
  kind: Step["kind"];
  moduleTitle: string;
}) {
  const meta = STEP_KIND_LABELS[kind];
  return (
    <div className="ph-panel ph-rivets sticky top-12 z-10 overflow-hidden lg:top-2">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="ph-stamp ph-stamp-active shrink-0">
            <span aria-hidden>{meta.icon}</span> {meta.label}
          </span>
          <span className="truncate font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            · {moduleTitle}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-[var(--color-fg-secondary)]">
          {stepIndex + 1} / {total}
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-[var(--color-bg-base)]">
        <div
          className="ph-stripes absolute inset-y-0 left-0 bg-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

function LessonNav({
  stepIndex,
  total,
  prev,
  next,
}: {
  stepIndex: number;
  total: number;
  prev: () => void;
  next: () => void;
}) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;
  const encourage = ENCOURAGE[stepIndex % ENCOURAGE.length] ?? "";

  return (
    <div className="ph-panel sticky bottom-[calc(env(safe-area-inset-bottom)+64px)] z-10 flex items-center justify-between gap-3 px-3 py-2.5 lg:bottom-2 lg:px-4">
      <button
        type="button"
        onClick={prev}
        disabled={isFirst}
        className="inline-flex min-h-[40px] items-center gap-1.5 border border-[var(--color-border-strong)] px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg-primary)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Prev
      </button>

      <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] sm:inline">
        {encourage}
      </span>

      {isLast ? (
        <Link
          href="/"
          className="inline-flex min-h-[40px] items-center gap-1.5 border-2 border-[var(--color-success)] bg-[color-mix(in_oklab,var(--color-success)_10%,transparent)] px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-success)] transition hover:bg-[color-mix(in_oklab,var(--color-success)_18%,transparent)]"
        >
          ✓ Atelier →
        </Link>
      ) : (
        <button
          type="button"
          onClick={next}
          className="inline-flex min-h-[40px] items-center gap-1.5 border-2 border-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)] px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[color-mix(in_oklab,var(--color-accent)_18%,transparent)]"
        >
          Suivant →
        </button>
      )}
    </div>
  );
}

// ============================================================
// STEP RENDERERS
// ============================================================

function StepIntro({ module: mod }: { module: ModuleInfo }) {
  return (
    <article className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Pourquoi ce module
        </p>
        <h1 className="mt-2 text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl">
          {mod.title}
        </h1>
        {mod.subtitle && (
          <p className="mt-2 text-base leading-relaxed text-[var(--color-fg-secondary)]">
            {mod.subtitle}
          </p>
        )}
      </header>

      <section className="ph-panel ph-rivets relative overflow-hidden border-l-4 border-l-[var(--color-accent)]">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <div className="px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
            ► Le « pourquoi »
          </p>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-[var(--color-fg-primary)]">
            {mod.pourquoi}
          </p>
        </div>
      </section>

      {mod.objectives.length > 0 && (
        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
            À la fin tu sauras ({mod.objectives.length})
          </p>
          <ul className="space-y-2">
            {mod.objectives.map((obj, i) => (
              <li
                key={i}
                className="ph-panel flex items-start gap-3 px-4 py-3 transition hover:border-[var(--color-accent)]"
              >
                <span className="ph-ref shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Durée" value={`${mod.estimatedHours}h`} />
        <Stat label="Phase" value={`${mod.phase}/8`} />
        {mod.estimatedWeeks && (
          <Stat label="Estimé" value={`~${mod.estimatedWeeks}sem`} />
        )}
      </section>

      {mod.prerequisites && (
        <section className="ph-panel relative overflow-hidden px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Prérequis
          </p>
          <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
            {mod.prerequisites}
          </p>
        </section>
      )}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ph-panel ph-rivets relative overflow-hidden px-4 py-3">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function formatDuration(seconds: number | null): string | null {
  if (seconds == null) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m}min`;
}

function StepVideo({
  video,
  moduleId,
}: {
  video: Video;
  moduleId: string;
}) {
  const playerRef = useRef<YoutubePlayerHandle | null>(null);

  return (
    <article className="space-y-4 pb-32 lg:pb-20">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Vidéo principale
          {video.creator && <span> · {video.creator}</span>}
          {video.durationSeconds && (
            <span> · {formatDuration(video.durationSeconds)}</span>
          )}
        </p>
        <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">
          {video.title}
        </h2>
      </header>

      {video.youtubeId ? (
        <YoutubePlayer
          ref={playerRef}
          videoId={video.youtubeId}
          title={video.title}
        />
      ) : (
        <p className="text-sm text-[var(--color-fg-muted)]">
          Lien vidéo manquant.
        </p>
      )}

      {video.whyThisOne && (
        <p className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3 text-sm italic leading-relaxed text-[var(--color-fg-secondary)]">
          💡 {video.whyThisOne}
        </p>
      )}

      {video.youtubeId && (
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
        >
          Ouvrir sur YouTube ↗
        </a>
      )}

      {/* Panel notes vidéo ancré en bas — capture timestamp + seek back */}
      {video.youtubeId && (
        <VideoNotesPanel
          moduleId={moduleId}
          videoYoutubeId={video.youtubeId}
          videoTitle={video.title}
          playerRef={playerRef}
        />
      )}
    </article>
  );
}

function StepSkill({
  skill,
  allSkills,
  moduleNumber,
}: {
  skill: Skill;
  allSkills: Skill[];
  moduleNumber: number;
}) {
  const [mobileTab, setMobileTab] = useState<"read" | "code">("read");

  const codingPhases = moduleNumber >= 8; // M8+ = JS, donc sandbox utile
  // M24-M25 Python natif. M26 (algo transversal) → JS par défaut + switch autorisé.
  const allowSwitch = moduleNumber === 26;
  const language: "javascript" | "python" =
    moduleNumber === 24 || moduleNumber === 25 ? "python" : "javascript";

  const seedCode =
    language === "python"
      ? `# Essaie le concept : ${skill.label}\n# Modifie le code et lance avec ▶ Run\n\nprint("${skill.label}")\n`
      : `// Essaie le concept : ${skill.label}\n// Modifie le code et lance avec ▶ Run\n\nconsole.log("${skill.label}");\n`;

  const ReadPane = (
    <article className="flex flex-col gap-4">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Compétence à acquérir
        </p>
        <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">
          {skill.label}
        </h2>
        {skill.status && (
          <p className="mt-2 ph-ref">
            État : <span className="text-[var(--color-accent)]">{skill.status === "mastered" ? "acquis ✓" : skill.status === "practicing" ? "en pratique" : "à découvrir"}</span>
            {skill.masteryPct != null && (
              <span className="text-[var(--color-fg-muted)]"> · {skill.masteryPct}%</span>
            )}
          </p>
        )}
      </header>

      <PrereqsBanner prereqs={skill.prereqSkillSlugs} allSkills={allSkills} />

      <SkillLesson skill={skill} />

      <ExternalResourcesList resources={skill.resources} />

      {skill.description && (
        <p className="text-sm leading-relaxed text-[var(--color-fg-secondary)]">
          {skill.description}
        </p>
      )}

      {skill.videos && skill.videos.length > 0 && (
        <section>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Vidéos ({skill.videos.length})
          </p>
          <ul className="space-y-2">
            {skill.videos.map((v) => (
              <li key={v.youtubeId}>
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3 text-sm transition hover:border-[var(--color-accent)]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold">
                      {v.title ?? "Vidéo"}
                    </span>
                    <span className="ph-ref shrink-0">{v.lang.toUpperCase()}</span>
                  </div>
                  {v.channel && (
                    <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
                      {v.channel}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SkillValidator skill={skill} />
    </article>
  );

  const CodePane = codingPhases ? (
    <div className="flex h-[500px] flex-col gap-2 lg:h-[600px]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        ▶ Sandbox · expérimente
      </p>
      <div className="flex-1 min-h-0">
        <LazySandbox
          initialCode={seedCode}
          language={language}
          allowLanguageSwitch={allowSwitch}
        />
      </div>
    </div>
  ) : (
    <div className="ph-panel ph-rivets relative flex h-full min-h-[300px] flex-col items-center justify-center overflow-hidden px-6 py-8 text-center">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        Pas de sandbox sur ce module
      </p>
      <p className="mt-3 text-sm text-[var(--color-fg-secondary)]">
        Ce concept se travaille hors-éditeur (terminal, schémas, lecture). La
        sandbox revient sur les modules de code (à partir de M8 — JS fondamental).
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      {/* Mobile tabs */}
      <div className="lg:hidden">
        <div className="ph-panel mb-3 grid grid-cols-2 overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileTab("read")}
            className={`px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition ${mobileTab === "read" ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]"}`}
          >
            📖 Lire
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("code")}
            className={`px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition ${mobileTab === "code" ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]"}`}
          >
            💻 Coder
          </button>
        </div>
        {mobileTab === "read" ? ReadPane : CodePane}
      </div>

      {/* Desktop split-screen */}
      <div className="hidden lg:block">{ReadPane}</div>
      <div className="hidden lg:block">{CodePane}</div>
    </div>
  );
}

// ============================================================
// SkillLesson (Sprint B) — markdown rendu inline ou CTA "Générer"
// ============================================================
function SkillLesson({ skill }: { skill: Skill }) {
  const [markdown, setMarkdown] = useState(skill.contentMarkdown);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<{
        contentMarkdown: string;
        costCents: number;
        cached: boolean;
      }>(`/api/skills/${skill.id}/generate-lesson`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setMarkdown(res.contentMarkdown);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur génération leçon");
    } finally {
      setLoading(false);
    }
  }

  if (markdown) {
    return (
      <section className="ph-panel relative overflow-hidden px-5 py-4">
        <header className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
            📖 Leçon Porterfield
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                !confirm(
                  "Régénérer la leçon ? L'actuelle sera remplacée.",
                )
              )
                return;
              setMarkdown(null);
            }}
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
          >
            ↻ régénérer
          </button>
        </header>
        <Markdown source={markdown} />
      </section>
    );
  }

  return (
    <section className="ph-panel ph-rivets relative overflow-hidden border-l-4 border-l-[var(--color-accent)]">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <div className="px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
          📝 Leçon pas encore générée
        </p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Le coach Porterfield peut rédiger une leçon markdown ciblée sur ce
          skill (intro · concept · exemple code · pièges · question
          réflexion). ~10-15s.
        </p>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-3 inline-flex min-h-[40px] items-center border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:opacity-50"
        >
          {loading ? "génération…" : "▶ Générer cette leçon"}
        </button>
        {error && (
          <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    </section>
  );
}

// ============================================================
// ExternalResourcesList (Sprint C) — agrégation MDN/fCC/web.dev/…
// ============================================================
function ExternalResourcesList({
  resources,
}: {
  resources: ExternalResource[];
}) {
  if (resources.length === 0) return null;

  return (
    <section>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
        📚 Aller plus loin · {resources.length} sources curées
      </p>
      <ul className="space-y-2">
        {resources.map((r) => (
          <li key={r.id}>
            <ExternalResourceCard resource={r} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExternalResourceCard({ resource }: { resource: ExternalResource }) {
  const isBroken =
    resource.httpStatus !== null &&
    (resource.httpStatus >= 400 || resource.httpStatus === 0);

  const kindIcon =
    resource.kind === "video"
      ? "▶"
      : resource.kind === "exercise"
        ? "✎"
        : resource.kind === "course"
          ? "🎓"
          : resource.kind === "doc"
            ? "📄"
            : "📰";

  const levelTone =
    resource.level === "advanced"
      ? "text-[var(--color-danger)]"
      : resource.level === "intermediate"
        ? "text-[var(--color-warning)]"
        : "text-[var(--color-success)]";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="ph-panel block px-4 py-3 transition hover:border-[var(--color-accent)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="ph-ref shrink-0">
            {kindIcon} {resource.provider}
          </span>
          <span className={`ph-ref shrink-0 ${levelTone}`}>
            {resource.level}
          </span>
          <span className="ph-ref shrink-0">{resource.language.toUpperCase()}</span>
          {isBroken && (
            <span className="ph-ref shrink-0 text-[var(--color-danger)]">
              ⚠ à vérifier
            </span>
          )}
        </div>
        {resource.estimatedMinutes && (
          <span className="shrink-0 font-mono text-[10px] text-[var(--color-fg-muted)]">
            ~{resource.estimatedMinutes} min
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug">{resource.title}</p>
      {resource.whyThisOne && (
        <p className="mt-1 text-xs italic text-[var(--color-fg-secondary)]">
          {resource.whyThisOne}
        </p>
      )}
    </a>
  );
}

function PrereqsBanner({
  prereqs,
  allSkills,
}: {
  prereqs: string[];
  allSkills: Skill[];
}) {
  if (prereqs.length === 0) return null;

  const bySlug = new Map(allSkills.map((s) => [s.slug, s]));

  const resolved = prereqs.map((slug) => {
    const s = bySlug.get(slug);
    if (!s) {
      // Prereq d'un autre module (cross-module) — pas résolu ici en V1
      return {
        slug,
        label: slug,
        status: null as Skill["status"],
        crossModule: true,
      };
    }
    return {
      slug,
      label: s.label,
      status: s.status,
      crossModule: false,
    };
  });

  const allMastered = resolved.every((r) => r.status === "mastered");

  return (
    <section
      className={`ph-panel ph-rivets relative overflow-hidden border-l-4 ${allMastered ? "border-l-[var(--color-success)]" : "border-l-[var(--color-warning)]"}`}
    >
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <header className="ph-station-header flex items-center justify-between px-4 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
          Prérequis · {resolved.length}
        </span>
        <span className="ph-ref">
          {allMastered ? "✓ prêt" : "⚠ à acquérir"}
        </span>
      </header>
      <ul className="divide-y divide-[var(--color-border-subtle)]">
        {resolved.map((r) => {
          const isMastered = r.status === "mastered";
          const isPracticing = r.status === "practicing";
          const tone = isMastered
            ? "text-[var(--color-success)]"
            : isPracticing
              ? "text-[var(--color-warning)]"
              : "text-[var(--color-fg-muted)]";
          const icon = isMastered ? "✓" : isPracticing ? "≈" : "·";
          return (
            <li
              key={r.slug}
              className="flex items-center gap-3 px-4 py-2"
            >
              <span className={`shrink-0 font-mono text-base ${tone}`}>
                {icon}
              </span>
              <span className="flex-1 truncate text-sm">{r.label}</span>
              {r.crossModule && (
                <span className="ph-ref shrink-0">externe</span>
              )}
              {!r.crossModule && r.status && (
                <span className={`ph-ref shrink-0 ${tone}`}>
                  {r.status === "mastered"
                    ? "acquis"
                    : r.status === "practicing"
                      ? "en cours"
                      : "découverte"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SkillValidator({ skill }: { skill: Skill }) {
  const [status, setStatus] = useState(skill.status);
  const [question, setQuestion] = useState<{ question: string; expectedAnswer: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [validation, setValidation] = useState<{ verdict: string; feedback: string; masteryPct: number } | null>(null);
  const [loading, setLoading] = useState<"idle" | "asking" | "checking">("idle");
  const [error, setError] = useState<string | null>(null);
  const validateBtnRef = useRef<HTMLButtonElement | null>(null);

  const isMastered = status === "mastered";

  async function askQuestion() {
    setError(null);
    setLoading("asking");
    setValidation(null);
    try {
      const q = await apiFetch<{ question: string; expectedAnswer: string }>(
        `/api/skills/${skill.id}/check`,
        { method: "POST", body: JSON.stringify({}) },
      );
      setQuestion(q);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur génération question");
    } finally {
      setLoading("idle");
    }
  }

  async function validate() {
    if (!question || answer.trim().length === 0) return;
    setError(null);
    setLoading("checking");
    try {
      const v = await apiFetch<{ verdict: "mastered" | "practicing" | "discovering"; feedback: string; masteryPct: number }>(
        `/api/skills/${skill.id}/validate`,
        {
          method: "POST",
          body: JSON.stringify({
            question: question.question,
            expectedAnswer: question.expectedAnswer,
            userAnswer: answer,
          }),
        },
      );
      setValidation(v);
      setStatus(v.verdict);
      if (v.verdict === "mastered") {
        burstXp(25, "skill");
        const rect = validateBtnRef.current?.getBoundingClientRect();
        const origin = rect
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : undefined;
        burstSuccess(origin, "Compétence acquise !");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur validation");
    } finally {
      setLoading("idle");
    }
  }

  if (isMastered) {
    return (
      <div className="ph-panel relative overflow-hidden border-l-4 border-l-[var(--color-success)] px-4 py-3">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-success)]">
          ✓ Compétence acquise
        </p>
        <p className="mt-1 text-xs text-[var(--color-fg-secondary)]">
          Tu peux passer à l&apos;étape suivante ou la retester via le coach.
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="ph-panel relative overflow-hidden px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          Valider via IA
        </p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Le coach génère une question ciblée sur cette compétence. Tu
          réponds, il évalue.
        </p>
        <button
          type="button"
          onClick={askQuestion}
          disabled={loading !== "idle"}
          className="mt-3 inline-flex min-h-[40px] items-center border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:opacity-50"
        >
          {loading === "asking" ? "génération…" : "▶ Lancer une question"}
        </button>
        {error && (
          <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }

  if (validation) {
    const tone =
      validation.verdict === "mastered"
        ? "border-l-[var(--color-success)] text-[var(--color-success)]"
        : validation.verdict === "practicing"
          ? "border-l-[var(--color-warning)] text-[var(--color-warning)]"
          : "border-l-[var(--color-danger)] text-[var(--color-danger)]";
    return (
      <div className={`ph-panel relative overflow-hidden border-l-4 ${tone} px-4 py-3`}>
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            {validation.verdict === "mastered" ? "✓ Acquis" : validation.verdict === "practicing" ? "≈ À retravailler" : "✗ Non acquis"}
          </p>
          <span className="font-mono text-xs tabular-nums text-[var(--color-fg-muted)]">
            {validation.masteryPct}%
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-secondary)]">
          {validation.feedback}
        </p>
        {validation.verdict !== "mastered" && (
          <button
            type="button"
            onClick={() => {
              setQuestion(null);
              setAnswer("");
              setValidation(null);
            }}
            className="mt-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] hover:underline"
          >
            retenter →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="ph-panel relative overflow-hidden border-2 border-[var(--color-accent)] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
        Question de validation
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed">
        {question.question}
      </p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={loading === "checking"}
        rows={4}
        spellCheck={false}
        autoFocus
        className="mt-3 block w-full resize-y rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-2 font-mono text-sm leading-relaxed focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
        placeholder="Ta réponse…"
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setQuestion(null)}
          disabled={loading === "checking"}
          className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          annuler
        </button>
        <button
          ref={validateBtnRef}
          type="button"
          onClick={validate}
          disabled={loading === "checking" || answer.trim().length === 0}
          className="border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "checking" ? "vérification…" : "▶ valider"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

function StepExercise({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const isCode = exercise.kind === "code_exercise" || exercise.kind === "project_validation";
  const isQuiz = exercise.kind === "quiz_activation" || exercise.kind === "quiz_verification";
  const [mobileTab, setMobileTab] = useState<"read" | "code">("read");

  const language = exercise.language === "python" ? "python" : "javascript";

  const ReadPane = (
    <div className="space-y-3">
      <ExerciseRunner
        exerciseId={exercise.id}
        kind={exercise.kind}
        title={exercise.title}
        statement={exercise.statement}
        starterCode={exercise.starterCode}
        language={exercise.language}
        quizQuestions={exercise.quizQuestions}
        estimatedMinutes={exercise.estimatedMinutes}
        passThresholdPct={exercise.passThresholdPct}
        index={index}
      />
    </div>
  );

  // Pour code exercise : afficher aussi une sandbox de brouillon à droite
  const CodePane = isCode ? (
    <div className="flex h-[500px] flex-col gap-2 lg:h-[600px]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        ▶ Brouillon · teste avant de soumettre
      </p>
      <div className="flex-1 min-h-0">
        <LazySandbox
          initialCode={exercise.starterCode ?? `// Brouillon\n`}
          language={language}
          allowLanguageSwitch={false}
        />
      </div>
    </div>
  ) : null;

  if (isQuiz || !isCode) {
    // Quiz : pas de split-screen, juste le runner en pleine largeur
    return ReadPane;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      {/* Mobile tabs */}
      <div className="lg:hidden">
        <div className="ph-panel mb-3 grid grid-cols-2 overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileTab("read")}
            className={`px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition ${mobileTab === "read" ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]"}`}
          >
            📋 Énoncé
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("code")}
            className={`px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition ${mobileTab === "code" ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]"}`}
          >
            💻 Brouillon
          </button>
        </div>
        {mobileTab === "read" ? ReadPane : CodePane}
      </div>

      {/* Desktop split */}
      <div className="hidden lg:block">{ReadPane}</div>
      <div className="hidden lg:block">{CodePane}</div>
    </div>
  );
}

function StepExtras({ videos }: { videos: Video[] }) {
  return (
    <article className="space-y-4">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Pour aller plus loin
        </p>
        <h2 className="mt-2 text-xl font-bold sm:text-2xl">
          Ressources d&apos;approfondissement
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Optionnel. Cliquable, ouvre YouTube dans un nouvel onglet.
        </p>
      </header>

      <ul className="space-y-2">
        {videos.map((v) => {
          const href = v.youtubeId
            ? `https://www.youtube.com/watch?v=${v.youtubeId}`
            : null;
          const inner = (
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
                  {inner}
                </a>
              ) : (
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function StepRecap({
  module: mod,
  skills,
  status,
}: {
  module: ModuleInfo;
  skills: Skill[];
  status: "locked" | "active" | "completed";
}) {
  const mastered = skills.filter((s) => s.status === "mastered").length;
  const practicing = skills.filter((s) => s.status === "practicing").length;
  const total = skills.length;

  return (
    <article className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Récap · Module M{String(mod.moduleNumber).padStart(2, "0")}
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {status === "completed" ? "✓ Module validé" : "Bilan en cours"}
        </h2>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Acquis" value={`${mastered}`} />
        <Stat label="En cours" value={`${practicing}`} />
        <Stat label="Total" value={`${total}`} />
      </section>

      <section>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          Compétences
        </p>
        <ul className="space-y-1.5">
          {skills.map((s) => {
            const icon =
              s.status === "mastered"
                ? "✓"
                : s.status === "practicing"
                  ? "≈"
                  : "·";
            const tone =
              s.status === "mastered"
                ? "text-[var(--color-success)]"
                : s.status === "practicing"
                  ? "text-[var(--color-warning)]"
                  : "text-[var(--color-fg-muted)]";
            return (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2"
              >
                <span className={`shrink-0 font-mono text-base ${tone}`}>
                  {icon}
                </span>
                <span className="flex-1 text-sm">{s.label}</span>
                {s.masteryPct != null && (
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-[var(--color-fg-muted)]">
                    {s.masteryPct}%
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {status !== "completed" && (
        <p className="ph-panel relative overflow-hidden px-4 py-3 text-sm text-[var(--color-fg-secondary)]">
          Quand tous les exercices passent le seuil, le module passe en{" "}
          <span className="font-bold text-[var(--color-success)]">validé</span>{" "}
          automatiquement et débloque le suivant.
        </p>
      )}
    </article>
  );
}
