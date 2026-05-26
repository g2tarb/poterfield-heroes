"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";
import { CodeNoirVideos } from "@/components/code-noir/CodeNoirVideos";
import { VulgarizeButton } from "@/components/code-noir/VulgarizeButton";
import { CodeNoirQuiz } from "@/components/code-noir/CodeNoirQuiz";

type Technique = {
  slug: string;
  moduleNumber: number;
  kind: "offensive" | "defensive" | "duo";
  language: "js" | "python" | "both" | "concept";
  title: string;
  oneLiner: string;
  hack: string;
  antiHack: string;
  ctfRef?: string;
  cve?: string;
  youtubeSearch?: string;
  youtubeIds?: string[];
};

type TechniqueProgress = {
  status: "in_progress" | "mastered";
  quizScore: number | null;
  masteredAt: string | null;
  bestTimeMs?: number | null;
  killCount?: number | null;
};

type AchievementUnlocked = {
  slug: string;
  title: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
};

type KillResponse = {
  ok: boolean;
  newRecord: boolean;
  bestTimeMs: number;
  killCount: number;
  unlockedAchievements: AchievementUnlocked[];
};

function formatTimer(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

type TechniqueResponse = {
  technique: Technique;
  currentModule: number;
  progress: TechniqueProgress | null;
};

type Step = "intro" | "hack" | "defense" | "videos" | "quiz";

const STEPS: Array<{ key: Step; label: string; index: number }> = [
  { key: "intro", label: "Intro", index: 1 },
  { key: "hack", label: "Hack", index: 2 },
  { key: "defense", label: "Défense", index: 3 },
  { key: "videos", label: "Vidéos", index: 4 },
  { key: "quiz", label: "Quiz", index: 5 },
];

function visitedKey(slug: string): string {
  return `ph:codenoir:visited:${slug}`;
}

function readVisited(slug: string): Set<Step> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(visitedKey(slug));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.filter((s): s is Step =>
      ["intro", "hack", "defense", "videos", "quiz"].includes(s),
    ));
  } catch {
    return new Set();
  }
}

function writeVisited(slug: string, visited: Set<Step>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      visitedKey(slug),
      JSON.stringify([...visited]),
    );
  } catch {
    // ignore
  }
}

export function CodeNoirLessonClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [data, setData] = useState<TechniqueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("intro");
  const [visited, setVisited] = useState<Set<Step>>(new Set(["intro"]));
  const [progress, setProgress] = useState<TechniqueProgress | null>(null);

  // Kill timer (Paroxysme) — démarre au mount, sert au POST /kill
  const [startedAt] = useState<number>(() => Date.now());
  const [now, setNow] = useState<number>(() => Date.now());
  const [killing, setKilling] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    AchievementUnlocked[]
  >([]);
  const elapsedMs = now - startedAt;

  // Tick timer chaque seconde
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  async function recordKill(): Promise<void> {
    setKilling(true);
    try {
      const res = await apiFetch<KillResponse>(
        `/api/code-noir/${encodeURIComponent(slug)}/kill`,
        {
          method: "POST",
          body: JSON.stringify({ durationMs: elapsedMs }),
        },
      );
      setProgress({
        status: "mastered",
        quizScore: progress?.quizScore ?? null,
        masteredAt: new Date().toISOString(),
        bestTimeMs: res.bestTimeMs,
        killCount: res.killCount,
      });
      if (res.unlockedAchievements.length > 0) {
        setUnlockedAchievements(res.unlockedAchievements);
      }
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur kill";
      setError(msg);
    } finally {
      setKilling(false);
    }
  }

  // Load technique
  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<TechniqueResponse>(
          `/api/code-noir/technique/${encodeURIComponent(slug)}`,
        );
        setData(res);
        setProgress(res.progress);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Erreur chargement";
        setError(msg);
      }
    })();
  }, [slug]);

  // Restore visited from sessionStorage
  useEffect(() => {
    const v = readVisited(slug);
    if (v.size === 0) v.add("intro");
    setVisited(v);
  }, [slug]);

  // Mark current step as visited
  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(step)) return prev;
      const next = new Set(prev);
      next.add(step);
      writeVisited(slug, next);
      return next;
    });
  }, [step, slug]);

  // Persist "in_progress" status the first time we open the lesson
  useEffect(() => {
    if (!data) return;
    if (progress) return; // already has progress
    void apiFetch("/api/code-noir/progress", {
      method: "POST",
      body: JSON.stringify({ slug, status: "in_progress" }),
    })
      .then(() => {
        setProgress({ status: "in_progress", quizScore: null, masteredAt: null });
      })
      .catch(() => {
        // ignore: lesson still usable
      });
  }, [data, progress, slug]);

  const stepIndex = useMemo(
    () => STEPS.findIndex((s) => s.key === step),
    [step],
  );

  const allPriorVisited = useMemo(() => {
    // For quiz: require visited on intro/hack/defense/videos
    const required: Step[] = ["intro", "hack", "defense", "videos"];
    return required.every((s) => visited.has(s));
  }, [visited]);

  function goPrev(): void {
    if (stepIndex <= 0) return;
    const prevStep = STEPS[stepIndex - 1];
    if (prevStep) setStep(prevStep.key);
  }

  function goNext(): void {
    if (stepIndex >= STEPS.length - 1) return;
    const nextStep = STEPS[stepIndex + 1];
    if (!nextStep) return;
    if (nextStep.key === "quiz" && !allPriorVisited) return;
    setStep(nextStep.key);
  }

  if (error) {
    return (
      <div className="ph-noir-card p-4 text-sm">
        <p className="text-[rgba(255,0,80,0.8)] font-mono">$ ERROR: {error}</p>
        <button
          type="button"
          onClick={() => router.push("/code-noir")}
          className="mt-3 border border-[#00ff88] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.1)]"
          style={{ minHeight: 40 }}
        >
          ← retour au tree
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ph-noir-card p-6 text-center text-sm text-[rgba(0,255,136,0.7)]">
        <p className="font-mono">$ loading technique…</p>
      </div>
    );
  }

  const t = data.technique;
  const kindLabel =
    t.kind === "offensive"
      ? "⚔ OFFENSIVE"
      : t.kind === "defensive"
        ? "🛡 DEFENSIVE"
        : "⇋ DUO";

  return (
    <div className="space-y-5 pb-32">
      {/* Header */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
          M{String(t.moduleNumber).padStart(2, "0")} · {kindLabel} ·{" "}
          {t.language.toUpperCase()}
          {progress?.status === "mastered" && (
            <span className="ml-2 text-[#00ff88]">· ✓ MAÎTRISÉE</span>
          )}
          {progress?.status === "in_progress" && (
            <span className="ml-2 text-[rgba(0,255,136,0.7)]">· EN COURS</span>
          )}
        </p>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-wider ph-noir-glow sm:text-3xl">
          {t.title}
        </h1>
      </header>

      {/* Stepper */}
      <Stepper
        currentStep={step}
        visited={visited}
        quizUnlocked={allPriorVisited}
        onChange={(s) => {
          if (s === "quiz" && !allPriorVisited) return;
          setStep(s);
        }}
      />

      {/* Content */}
      <section className="min-h-[280px]">
        {step === "intro" && <IntroStep technique={t} />}
        {step === "hack" && <HackStep technique={t} />}
        {step === "defense" && <DefenseStep technique={t} />}
        {step === "videos" && <VideosStep technique={t} />}
        {step === "quiz" && (
          <CodeNoirQuiz
            slug={t.slug}
            initialMastered={progress?.status === "mastered"}
            onMastered={(score) => {
              setProgress({
                status: "mastered",
                quizScore: score,
                masteredAt: new Date().toISOString(),
              });
            }}
          />
        )}
      </section>

      {/* Achievement modal */}
      {unlockedAchievements.length > 0 && (
        <AchievementsUnlockedModal
          achievements={unlockedAchievements}
          onClose={() => setUnlockedAchievements([])}
        />
      )}

      {/* Sticky nav bottom — Kill timer + Prev/Next */}
      <div
        className="sticky bottom-0 -mx-4 border-t border-[rgba(0,255,136,0.25)] bg-black/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Kill timer panel */}
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[rgba(0,255,136,0.15)] pb-2">
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
              ⏱ elapsed
            </span>
            <span className="font-mono text-lg tabular-nums text-[#00ff88] ph-noir-glow">
              {formatTimer(elapsedMs)}
            </span>
          </div>

          {progress?.bestTimeMs != null && (
            <div className="flex flex-col items-end leading-tight">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
                ▼ best
              </span>
              <span className="font-mono text-sm tabular-nums text-[rgba(0,255,136,0.85)]">
                {formatTimer(progress.bestTimeMs)}
                {progress.killCount && progress.killCount > 1 && (
                  <span className="ml-1 text-[rgba(0,255,136,0.4)]">
                    · ×{progress.killCount}
                  </span>
                )}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={recordKill}
            disabled={killing}
            className="ph-noir-glow border-2 border-[#00ff88] bg-[rgba(0,255,136,0.08)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.18)] disabled:opacity-50"
            style={{ minHeight: 40 }}
          >
            {killing
              ? "killing..."
              : progress?.status === "mastered"
                ? `▶ RE-KILL · ${formatTimer(elapsedMs)}`
                : `✓ KILL · ${formatTimer(elapsedMs)}`}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex <= 0}
            className="border border-[rgba(0,255,136,0.4)] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.8)] transition hover:bg-[rgba(0,255,136,0.06)] disabled:opacity-30"
            style={{ minHeight: 40 }}
          >
            ← précédent
          </button>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
            {stepIndex + 1} / {STEPS.length}
          </p>
          <button
            type="button"
            onClick={goNext}
            disabled={
              stepIndex >= STEPS.length - 1 ||
              (STEPS[stepIndex + 1]?.key === "quiz" && !allPriorVisited)
            }
            className="ph-noir-glow border-2 border-[#00ff88] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.1)] disabled:opacity-30"
            style={{ minHeight: 40 }}
          >
            suivant →
          </button>
        </div>
        {STEPS[stepIndex + 1]?.key === "quiz" && !allPriorVisited && (
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-[rgba(255,200,0,0.6)]">
            ⚠ visite les 4 premières étapes pour débloquer le quiz
          </p>
        )}
      </div>
    </div>
  );
}

function Stepper({
  currentStep,
  visited,
  quizUnlocked,
  onChange,
}: {
  currentStep: Step;
  visited: Set<Step>;
  quizUnlocked: boolean;
  onChange: (s: Step) => void;
}) {
  return (
    <ol
      className="sticky z-20 -mx-4 flex items-center gap-1 overflow-x-auto border-y border-[rgba(0,255,136,0.2)] bg-black/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
      style={{ top: "max(0px, env(safe-area-inset-top))" }}
    >
      {STEPS.map((s, idx) => {
        const isActive = s.key === currentStep;
        const isDone = visited.has(s.key) && !isActive;
        const isLocked = s.key === "quiz" && !quizUnlocked;
        return (
          <li
            key={s.key}
            className="flex shrink-0 items-center gap-1"
          >
            <button
              type="button"
              onClick={() => !isLocked && onChange(s.key)}
              disabled={isLocked}
              className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${
                isActive
                  ? "ph-noir-glow border-[#00ff88] bg-[rgba(0,255,136,0.1)] text-[#00ff88]"
                  : isDone
                    ? "border-[rgba(0,255,136,0.5)] text-[#00ff88] hover:bg-[rgba(0,255,136,0.06)]"
                    : isLocked
                      ? "border-[rgba(0,255,136,0.15)] text-[rgba(0,255,136,0.3)]"
                      : "border-[rgba(0,255,136,0.3)] text-[rgba(0,255,136,0.6)] hover:bg-[rgba(0,255,136,0.04)]"
              }`}
              style={{ minHeight: 36 }}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                aria-hidden
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                  isDone
                    ? "border-[#00ff88] bg-[#00ff88] text-black"
                    : isActive
                      ? "border-[#00ff88] text-[#00ff88]"
                      : "border-current"
                }`}
              >
                {isDone ? "✓" : isLocked ? "⊘" : s.index}
              </span>
              <span>{s.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <span
                aria-hidden
                className="h-px w-3 shrink-0 bg-[rgba(0,255,136,0.25)] sm:w-5"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function IntroStep({ technique }: { technique: Technique }) {
  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed text-[rgba(0,255,136,0.95)] sm:text-xl">
        {technique.oneLiner}
      </p>

      <div className="rounded border-2 border-dashed border-[rgba(0,255,136,0.4)] bg-[rgba(0,10,5,0.55)] p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
          // TL;DR — clic Vulgariser pour l'analogie
        </p>
        <VulgarizeButton slug={technique.slug} section="oneLiner" />
      </div>

      {(technique.ctfRef || technique.cve) && (
        <div className="space-y-1 border-t border-[rgba(0,255,136,0.2)] pt-3 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
          {technique.ctfRef && <p>► CTF : {technique.ctfRef}</p>}
          {technique.cve && (
            <p className="text-[rgba(255,80,80,0.7)]">► CVE : {technique.cve}</p>
          )}
        </div>
      )}
    </div>
  );
}

function HackStep({ technique }: { technique: Technique }) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-widest text-[rgba(255,80,80,0.8)]">
        ⚔ HACK — comment ça casse
      </p>
      <VulgarizeButton slug={technique.slug} section="hack" />
      <div className="prose-coach text-[rgba(0,255,136,0.9)]">
        <Markdown source={technique.hack} />
      </div>
    </div>
  );
}

function DefenseStep({ technique }: { technique: Technique }) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-widest text-[#00ff88]">
        🛡 ANTI-HACK — comment tu défends
      </p>
      <VulgarizeButton slug={technique.slug} section="antiHack" />
      <div className="prose-coach text-[rgba(0,255,136,0.9)]">
        <Markdown source={technique.antiHack} />
      </div>
    </div>
  );
}

function VideosStep({ technique }: { technique: Technique }) {
  return (
    <div>
      <CodeNoirVideos
        title={technique.title}
        {...(technique.youtubeSearch !== undefined
          ? { search: technique.youtubeSearch }
          : {})}
        {...(technique.youtubeIds !== undefined
          ? { videoIds: technique.youtubeIds }
          : {})}
      />
    </div>
  );
}

// ============================================================
// Achievements unlocked modal — célébration ph-noir
// ============================================================
const RARITY_COLOR: Record<AchievementUnlocked["rarity"], string> = {
  common: "rgba(0,255,136,0.7)",
  rare: "rgba(80,180,255,0.85)",
  epic: "rgba(200,120,255,0.9)",
  legendary: "rgba(255,215,80,0.95)",
};

function AchievementsUnlockedModal({
  achievements,
  onClose,
}: {
  achievements: AchievementUnlocked[];
  onClose: () => void;
}) {
  // Auto-close après 6s par achievement, ou close immédiat au click
  useEffect(() => {
    const id = window.setTimeout(
      onClose,
      Math.min(12_000, 4_000 + achievements.length * 2_000),
    );
    return () => window.clearTimeout(id);
  }, [achievements, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[80] grid place-items-center bg-black/85 backdrop-blur-sm ph-noir-scan"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 px-6 py-8"
      >
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-[rgba(0,255,136,0.5)] ph-noir-flicker">
          ╳ ACHIEVEMENT{achievements.length > 1 ? "S" : ""} UNLOCKED ╳
        </p>
        {achievements.map((a) => {
          const tone = RARITY_COLOR[a.rarity];
          return (
            <article
              key={a.slug}
              className="border-2 bg-[rgba(0,255,136,0.04)] p-4"
              style={{ borderColor: tone }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-3xl ph-noir-glow"
                  style={{ color: tone }}
                  aria-hidden
                >
                  {a.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: tone, opacity: 0.7 }}
                  >
                    {a.rarity}
                  </p>
                  <h3
                    className="text-base font-bold uppercase tracking-wider"
                    style={{ color: tone }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[rgba(0,255,136,0.75)]">
                    {a.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.4)]">
          click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
