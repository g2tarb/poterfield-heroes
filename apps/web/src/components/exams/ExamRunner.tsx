"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Sandbox } from "@/components/sandbox/Sandbox";
import { cn } from "@/lib/cn";

type QuestionQcm = {
  kind: "qcm";
  question: string;
  options: string[];
  skillId?: string;
};

type QuestionCode = {
  kind: "code";
  prompt: string;
  language: "javascript" | "python" | "bash";
  starterCode?: string;
  skillId?: string;
};

type Question = QuestionQcm | QuestionCode;

type CurrentExam = {
  id: string;
  weekStartDate: string;
  timeLimitMinutes: number;
  questions: Question[];
  submitted: boolean;
};

type SubmitResult = {
  scorePct: number;
  passed: boolean;
  questions: Array<
    | (QuestionQcm & { correctIndex: number; explanation: string })
    | (QuestionCode & { expectedBehavior: string })
  >;
};

export function ExamRunner() {
  const [exam, setExam] = useState<CurrentExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    Record<number, string | number | null>
  >({});
  const [startedAt] = useState<string>(() => new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<CurrentExam>("/api/exams/current");
        setExam(data);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          setError("not_yet");
        } else {
          setError((e as Error).message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Timer
  const deadline = useMemo(() => {
    if (!exam) return 0;
    return Date.now() + exam.timeLimitMinutes * 60 * 1000;
  }, [exam]);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!exam) return;
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline, exam]);

  async function submit() {
    if (!exam) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        answers: Object.entries(answers)
          .filter(([, v]) => v != null)
          .map(([i, v]) => ({
            questionIndex: Number(i),
            answer: v as string | number,
          })),
        startedAt,
        durationSeconds: Math.round(
          (Date.now() - new Date(startedAt).getTime()) / 1000,
        ),
      };
      const res = await apiFetch<SubmitResult>(
        `/api/exams/${exam.id}/submit`,
        { method: "POST", body: JSON.stringify(payload) },
      );
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-[var(--color-fg-muted)]">Chargement de l&apos;exam…</p>
    );
  }

  if (error === "not_yet") {
    return (
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6">
        <p>Pas encore d&apos;examen pour cette semaine.</p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          La génération automatique tourne tous les vendredis à 18h.{" "}
          <button
            type="button"
            onClick={async () => {
              try {
                await apiFetch("/api/exams/generate-week", {
                  method: "POST",
                  body: "{}",
                });
                window.location.reload();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
            className="underline hover:text-[var(--color-fg-primary)]"
          >
            Forcer maintenant
          </button>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-6 text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  if (!exam) return null;

  if (result) {
    return (
      <div className="max-w-3xl">
        <div
          className={cn(
            "mb-8 rounded-2xl border p-6",
            result.passed
              ? "border-[var(--color-success)]"
              : "border-[var(--color-danger)]",
          )}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            Résultat
          </p>
          <p className="mt-2 text-5xl font-semibold">{result.scorePct}%</p>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            {result.passed
              ? "Validé. Garde la cadence."
              : "Sous le seuil 70%. On revoit les concepts loupés."}
          </p>
        </div>

        <h3 className="mb-4 text-lg font-semibold">Corrections détaillées</h3>
        <ol className="space-y-4">
          {result.questions.map((q, i) => {
            const userAnswer = answers[i];
            if (q.kind === "qcm") {
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <li
                  key={i}
                  className={cn(
                    "rounded-lg border p-4",
                    isCorrect
                      ? "border-[var(--color-success)] bg-[var(--color-bg-elevated)]"
                      : "border-[var(--color-danger)] bg-[var(--color-bg-elevated)]",
                  )}
                >
                  <p className="font-semibold">
                    {i + 1}. {q.question}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.options.map((opt, oi) => (
                      <li
                        key={oi}
                        className={cn(
                          oi === q.correctIndex &&
                            "text-[var(--color-success)]",
                          oi === userAnswer &&
                            oi !== q.correctIndex &&
                            "text-[var(--color-danger)] line-through",
                        )}
                      >
                        {oi === q.correctIndex ? "✓ " : oi === userAnswer ? "✗ " : "  "}
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs italic text-[var(--color-fg-secondary)]">
                    {q.explanation}
                  </p>
                </li>
              );
            }
            return (
              <li
                key={i}
                className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4"
              >
                <p className="font-semibold">
                  {i + 1}. {q.prompt}
                </p>
                <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                  Évaluation manuelle / coach. Comportement attendu :
                </p>
                <p className="mt-1 text-sm italic text-[var(--color-fg-secondary)]">
                  {q.expectedBehavior}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const timeLow = remaining < 5 * 60 * 1000;

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Sticky timer */}
      <div
        className={cn(
          "sticky top-4 z-10 mb-8 flex items-center justify-between rounded-full border bg-[var(--color-bg-elevated)] px-4 py-2",
          timeLow
            ? "border-[var(--color-danger)] text-[var(--color-danger)]"
            : "border-[var(--color-border-subtle)]",
        )}
      >
        <span className="font-mono text-xs uppercase tracking-widest">
          Temps restant
        </span>
        <span className="font-mono text-lg tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </span>
      </div>

      <ol className="space-y-8">
        {exam.questions.map((q, i) => (
          <li
            key={i}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5"
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Question {i + 1} / {exam.questions.length} · {q.kind}
            </p>
            {q.kind === "qcm" ? (
              <div>
                <p className="text-base leading-relaxed">{q.question}</p>
                <ul className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => (
                    <li key={oi}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition",
                          answers[i] === oi
                            ? "border-[var(--color-accent)] bg-[var(--color-bg-high)]"
                            : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]",
                        )}
                      >
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === oi}
                          onChange={() =>
                            setAnswers((s) => ({ ...s, [i]: oi }))
                          }
                          className="accent-[var(--color-accent)]"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="mb-3 text-base leading-relaxed">{q.prompt}</p>
                <Sandbox
                  initialCode={q.starterCode ?? "// Ton code ici…"}
                  language={q.language === "python" ? "javascript" : "javascript"}
                />
                <textarea
                  value={(answers[i] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers((s) => ({ ...s, [i]: e.target.value }))
                  }
                  placeholder="Colle ici ta solution finale à soumettre"
                  className="mt-3 w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3 font-mono text-sm"
                  rows={6}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--color-fg-muted)]">
          {Object.values(answers).filter((v) => v != null).length} /{" "}
          {exam.questions.length} répondues
        </p>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="rounded-md bg-[var(--color-accent)] px-6 py-2.5 font-mono text-sm uppercase tracking-wider text-[var(--color-accent-fg)] disabled:opacity-50"
        >
          {submitting ? "Envoi…" : "Soumettre le contrôle"}
        </button>
      </div>
    </div>
  );
}
