"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

type QuizQ = {
  question: string;
  options?: string[];
  correctIndex?: number;
  correctText?: string;
  explanation: string;
};

type Props = {
  exerciseId: string;
  kind:
    | "quiz_activation"
    | "quiz_verification"
    | "code_exercise"
    | "project_validation";
  title: string;
  statement: string;
  starterCode: string | null;
  language: string | null;
  quizQuestions: QuizQ[] | null;
  estimatedMinutes: number | null;
  passThresholdPct: number;
  index: number;
};

type CorrectionResponse = {
  verdict: "correct" | "partial" | "incorrect";
  scorePct: number;
  passed: boolean;
  feedback: string;
  suggestions: string | null;
  attemptNumber: number;
  passThresholdPct: number;
};

export function ExerciseRunner({
  exerciseId,
  kind,
  title,
  statement,
  starterCode,
  language,
  quizQuestions,
  estimatedMinutes,
  passThresholdPct,
  index,
}: Props) {
  const isQuiz = kind === "quiz_activation" || kind === "quiz_verification";

  const [expanded, setExpanded] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const [code, setCode] = useState(starterCode ?? "");
  const [quizAnswers, setQuizAnswers] = useState<Map<number, string | number>>(
    new Map(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CorrectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kindLabel = {
    quiz_activation: { label: "Quiz d'activation", icon: "🎯" },
    quiz_verification: { label: "Quiz de vérification", icon: "✅" },
    code_exercise: { label: "Exercice code", icon: "💻" },
    project_validation: { label: "Projet de validation", icon: "🎓" },
  }[kind];

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const body: Record<string, unknown> = { startedAt };
      if (isQuiz) {
        const answers = Array.from(quizAnswers.entries()).map(
          ([questionIndex, answer]) => ({ questionIndex, answer }),
        );
        if (answers.length === 0) {
          setError("Réponds à au moins une question avant de soumettre.");
          setSubmitting(false);
          return;
        }
        body["quizAnswers"] = answers;
      } else {
        if (code.trim().length === 0) {
          setError("Ta réponse est vide.");
          setSubmitting(false);
          return;
        }
        body["answer"] = code;
      }

      const res = await apiFetch<CorrectionResponse>(
        `/api/exercises/${exerciseId}/correct`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      setResult(res);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur correction";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForRetry() {
    setResult(null);
    setError(null);
  }

  return (
    <article className="ph-panel ph-rivets relative overflow-hidden">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="ph-station-header flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
            Étape {String(index + 1).padStart(2, "0")}
          </span>
          <span className="ph-ref">{kindLabel.label}</span>
          {estimatedMinutes && (
            <span className="ph-ref hidden sm:inline">~{estimatedMinutes} min</span>
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          {expanded ? "▼ replier" : "▶ ouvrir"}
        </span>
      </button>

      <div className="px-5 py-4">
        <h3 className="text-base font-bold uppercase leading-tight tracking-wide">
          <span aria-hidden className="mr-2">
            {kindLabel.icon}
          </span>
          {title}
        </h3>

        {!expanded && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg-secondary)] line-clamp-2">
            {statement.split("\n").slice(0, 2).join(" ")}
          </p>
        )}

        {expanded && (
          <div className="mt-4 space-y-4">
            <pre className="whitespace-pre-wrap rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3 font-sans text-sm leading-relaxed text-[var(--color-fg-secondary)]">
              {statement}
            </pre>

            {isQuiz && quizQuestions && quizQuestions.length > 0 ? (
              <QuizForm
                questions={quizQuestions}
                answers={quizAnswers}
                onChange={setQuizAnswers}
                disabled={submitting || result !== null}
              />
            ) : (
              <CodeArea
                value={code}
                onChange={setCode}
                language={language}
                disabled={submitting || result !== null}
              />
            )}

            {error && (
              <p className="text-sm text-[var(--color-danger)]" role="alert">
                {error}
              </p>
            )}

            {result ? (
              <CorrectionDisplay result={result} onRetry={resetForRetry} />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  Seuil de validation : {passThresholdPct}%
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ph-stripes border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "correction en cours…" : "▶ corriger via IA"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function CodeArea({
  value,
  onChange,
  language,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  language: string | null;
  disabled: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          Ta réponse {language ? `· ${language}` : ""}
        </label>
        <span className="font-mono text-[10px] text-[var(--color-fg-muted)] tabular-nums">
          {value.length} chars
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        className="block min-h-[180px] w-full resize-y rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-3 font-mono text-sm leading-relaxed text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
        placeholder="// Écris ta réponse ici…"
      />
    </div>
  );
}

function QuizForm({
  questions,
  answers,
  onChange,
  disabled,
}: {
  questions: QuizQ[];
  answers: Map<number, string | number>;
  onChange: (next: Map<number, string | number>) => void;
  disabled: boolean;
}) {
  function set(qi: number, value: string | number) {
    const next = new Map(answers);
    next.set(qi, value);
    onChange(next);
  }
  return (
    <ol className="space-y-4">
      {questions.map((q, qi) => (
        <li key={qi} className="rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Question {qi + 1}/{questions.length}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed">{q.question}</p>

          {q.options && q.options.length > 0 ? (
            <div className="mt-3 space-y-1.5">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 transition ${answers.get(qi) === oi ? "bg-[var(--color-bg-elevated)]" : "hover:bg-[var(--color-bg-elevated)]"} ${disabled ? "pointer-events-none opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers.get(qi) === oi}
                    onChange={() => set(qi, oi)}
                    disabled={disabled}
                    className="mt-0.5 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={(answers.get(qi) as string | undefined) ?? ""}
              onChange={(e) => set(qi, e.target.value)}
              disabled={disabled}
              className="mt-2 block w-full rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-2 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
              placeholder="Ta réponse…"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function CorrectionDisplay({
  result,
  onRetry,
}: {
  result: CorrectionResponse;
  onRetry: () => void;
}) {
  const verdictColor = {
    correct: "text-[var(--color-success)]",
    partial: "text-[var(--color-warning)]",
    incorrect: "text-[var(--color-danger)]",
  }[result.verdict];

  const verdictLabel = {
    correct: "✓ Correct",
    partial: "≈ Partiel",
    incorrect: "✗ Incorrect",
  }[result.verdict];

  return (
    <div className="rounded border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-base)] p-4">
      <div className="flex items-baseline justify-between">
        <p className={`font-mono text-sm font-bold uppercase tracking-widest ${verdictColor}`}>
          {verdictLabel}
        </p>
        <p className="font-mono text-xs tabular-nums">
          <span className="text-2xl font-bold">{result.scorePct}</span>
          <span className="text-[var(--color-fg-muted)]">/100</span>
          {result.passed && (
            <span className="ml-2 ph-stamp ph-stamp-done">validé</span>
          )}
        </p>
      </div>

      <div className="prose-coach mt-3 text-sm leading-relaxed text-[var(--color-fg-secondary)]">
        {result.feedback.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {result.suggestions && (
        <div className="mt-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Pistes
          </p>
          <p className="mt-1 text-sm text-[var(--color-fg-secondary)]">
            {result.suggestions}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          Tentative #{result.attemptNumber}
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] hover:underline"
        >
          retenter →
        </button>
      </div>
    </div>
  );
}
