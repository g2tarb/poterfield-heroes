"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";

type QuizQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

type Props = {
  slug: string;
  initialMastered: boolean;
  onMastered?: (score: number) => void;
};

type Phase = "loading" | "ready" | "running" | "done" | "error";

export function CodeNoirQuiz({ slug, initialMastered, onMastered }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Array<{ correct: boolean }>>([]);
  const [mastered, setMastered] = useState(initialMastered);
  const [persisting, setPersisting] = useState(false);

  async function loadQuiz(regenerate = false): Promise<void> {
    setPhase("loading");
    setError(null);
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    try {
      const res = await apiFetch<{ questions: QuizQuestion[] }>(
        `/api/code-noir/quiz/${encodeURIComponent(slug)}`,
        {
          method: "POST",
          body: JSON.stringify(regenerate ? { regenerate: true } : {}),
        },
      );
      setQuestions(res.questions);
      setPhase("ready");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur quiz";
      setError(msg);
      setPhase("error");
    }
  }

  useEffect(() => {
    void loadQuiz(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function reveal(): void {
    if (selected === null) return;
    const q = questions[currentIdx];
    if (!q) return;
    const isCorrect = selected === q.correctIndex;
    setAnswers((prev) => [...prev, { correct: isCorrect }]);
    setRevealed(true);
  }

  function next(): void {
    if (currentIdx + 1 >= questions.length) {
      setPhase("done");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function start(): void {
    setPhase("running");
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
  }

  async function markAsMastered(): Promise<void> {
    setPersisting(true);
    try {
      const correctCount = answers.filter((a) => a.correct).length;
      const scorePct = Math.round((correctCount / Math.max(1, questions.length)) * 100);
      await apiFetch("/api/code-noir/progress", {
        method: "POST",
        body: JSON.stringify({
          slug,
          status: "mastered",
          quizScore: scorePct,
        }),
      });
      setMastered(true);
      onMastered?.(scorePct);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur sauvegarde";
      setError(msg);
    } finally {
      setPersisting(false);
    }
  }

  if (phase === "loading") {
    return (
      <div className="ph-noir-card p-4 text-sm text-[rgba(0,255,136,0.7)]">
        <p className="font-mono">$ generating quiz…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="ph-noir-card p-4 text-sm">
        <p className="text-[rgba(255,0,80,0.8)] font-mono">
          $ ERROR: {error ?? "quiz failed"}
        </p>
        <button
          type="button"
          onClick={() => void loadQuiz(false)}
          className="mt-3 border border-[#00ff88] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.1)]"
          style={{ minHeight: 40 }}
        >
          retry
        </button>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="ph-noir-card p-5">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
          ▷ QUIZ — 3 questions
        </p>
        <p className="mb-4 text-sm text-[rgba(0,255,136,0.85)]">
          Trois questions pour valider la maîtrise. 3/3 → tu peux marquer la
          technique comme maîtrisée.
        </p>
        <button
          type="button"
          onClick={start}
          className="ph-noir-glow border-2 border-[#00ff88] bg-[rgba(0,255,136,0.06)] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.12)]"
          style={{ minHeight: 44 }}
        >
          ▶ démarrer
        </button>
        {mastered && (
          <p className="mt-3 font-mono text-xs text-[rgba(0,255,136,0.6)]">
            ✓ déjà maîtrisée
          </p>
        )}
      </div>
    );
  }

  if (phase === "done") {
    const correctCount = answers.filter((a) => a.correct).length;
    const total = questions.length;
    const allCorrect = correctCount === total;
    const verdict = allCorrect
      ? "3/3 — propre. Tu peux marquer la technique comme maîtrisée."
      : `${correctCount}/${total} — pas mal mais relis la défense avant de cocher.`;

    return (
      <div className="ph-noir-card p-5">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
          ▣ RÉSULTAT
        </p>
        <p className="mb-4 text-lg font-bold ph-noir-glow">
          {correctCount} / {total}
        </p>
        <p className="mb-5 text-sm text-[rgba(0,255,136,0.85)]">{verdict}</p>
        <div className="flex flex-wrap gap-2">
          {allCorrect && !mastered && (
            <button
              type="button"
              onClick={() => void markAsMastered()}
              disabled={persisting}
              className="ph-noir-glow border-2 border-[#00ff88] bg-[rgba(0,255,136,0.1)] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.18)] disabled:opacity-40"
              style={{ minHeight: 44 }}
            >
              {persisting ? "$ saving..." : "⚑ marquer comme maîtrisée"}
            </button>
          )}
          {mastered && (
            <span className="ph-noir-glow border-2 border-[#00ff88] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88]">
              ✓ MAÎTRISÉE
            </span>
          )}
          {!allCorrect && (
            <button
              type="button"
              onClick={() => void loadQuiz(true)}
              className="border-2 border-[rgba(0,255,136,0.5)] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.08)]"
              style={{ minHeight: 44 }}
            >
              ↻ refaire le quiz
            </button>
          )}
          <button
            type="button"
            onClick={start}
            className="border border-[rgba(0,255,136,0.3)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.7)] transition hover:bg-[rgba(0,255,136,0.06)]"
            style={{ minHeight: 40 }}
          >
            relire les mêmes questions
          </button>
        </div>
      </div>
    );
  }

  // phase === "running"
  const q = questions[currentIdx];
  if (!q) {
    return (
      <div className="ph-noir-card p-4 text-sm text-[rgba(255,80,80,0.8)]">
        $ ERROR: question manquante
      </div>
    );
  }

  return (
    <div className="ph-noir-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
          ▸ Question {currentIdx + 1} / {questions.length}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.4)]">
          ✓ {answers.filter((a) => a.correct).length}
        </p>
      </div>
      <p className="mb-4 text-base font-semibold text-[rgba(0,255,136,0.95)]">
        {q.question}
      </p>
      <ul className="space-y-2">
        {q.choices.map((choice, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === q.correctIndex;
          const showCorrect = revealed && isCorrect;
          const showWrongSelection = revealed && isSelected && !isCorrect;
          const baseBorder = revealed
            ? showCorrect
              ? "border-[#00ff88] bg-[rgba(0,255,136,0.12)] ph-noir-glow"
              : showWrongSelection
                ? "border-[rgba(255,80,80,0.7)] bg-[rgba(255,80,80,0.08)]"
                : "border-[rgba(0,255,136,0.2)] opacity-70"
            : isSelected
              ? "border-[#00ff88] bg-[rgba(0,255,136,0.08)]"
              : "border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.04)]";
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => {
                  if (!revealed) setSelected(idx);
                }}
                disabled={revealed}
                className={`flex w-full items-start gap-3 border-2 px-3 py-2 text-left text-sm transition disabled:cursor-default ${baseBorder}`}
                style={{ minHeight: 44 }}
              >
                <span
                  className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[10px] ${
                    isSelected || showCorrect
                      ? "border-[#00ff88] text-[#00ff88]"
                      : "border-[rgba(0,255,136,0.4)] text-[rgba(0,255,136,0.5)]"
                  }`}
                  aria-hidden
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 text-[rgba(0,255,136,0.9)]">{choice}</span>
                {revealed && isCorrect && (
                  <span className="font-mono text-xs text-[#00ff88]">✓</span>
                )}
                {showWrongSelection && (
                  <span className="font-mono text-xs text-[rgba(255,80,80,0.8)]">
                    ╳
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className="mt-4 rounded border border-dashed border-[rgba(0,255,136,0.4)] bg-[rgba(0,10,5,0.5)] p-3">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
            // explication
          </p>
          <div className="prose-coach text-sm text-[rgba(0,255,136,0.9)]">
            <Markdown source={q.explanation} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {!revealed ? (
          <button
            type="button"
            onClick={reveal}
            disabled={selected === null}
            className="border-2 border-[#00ff88] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.1)] disabled:opacity-40"
            style={{ minHeight: 44 }}
          >
            valider
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="ph-noir-glow border-2 border-[#00ff88] bg-[rgba(0,255,136,0.06)] px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.14)]"
            style={{ minHeight: 44 }}
          >
            {currentIdx + 1 >= questions.length ? "voir le score →" : "suivant →"}
          </button>
        )}
      </div>
    </div>
  );
}
