import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { LessonPlayer } from "@/components/module/LessonPlayer";

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
    description: string | null;
    weight: number;
    displayOrder: number;
    videos: Array<{
      youtubeId: string;
      title?: string;
      channel?: string;
      lang: "fr" | "en";
    }>;
    status: "discovering" | "practicing" | "mastered" | null;
    masteryPct: number | null;
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

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getModule(id);
  if (!data) notFound();

  const status = data.progress?.status ?? "locked";

  if (status === "locked") {
    return (
      <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
        <nav className="mb-3 font-mono text-xs sm:mb-6">
          <Link
            href="/"
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
          >
            ← Atelier
          </Link>
        </nav>
        <div className="ph-panel ph-rivets relative overflow-hidden">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <div className="ph-station-header flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
              Station {String(data.module.moduleNumber).padStart(2, "0")} ·
              Verrouillée
            </span>
            <span className="ph-ref">LOCKED</span>
          </div>
          <div className="px-5 py-6">
            <h1 className="text-2xl font-bold uppercase tracking-wide">
              🔒 {data.module.title}
            </h1>
            <p className="mt-3 text-sm text-[var(--color-fg-secondary)]">
              Termine le module précédent pour déverrouiller celui-ci.
            </p>
            {data.module.prerequisites && (
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                Prérequis : {data.module.prerequisites}
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-6 xl:px-24">
      <nav className="mb-3 font-mono text-xs">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Atelier
        </Link>
      </nav>

      <LessonPlayer data={data} />
    </main>
  );
}
