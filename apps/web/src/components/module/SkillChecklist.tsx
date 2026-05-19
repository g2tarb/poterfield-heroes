"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { SkillVideos, type SkillVideo } from "./SkillVideos";

type Skill = {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  weight: number;
  displayOrder: number;
  videos?: SkillVideo[];
  status: "discovering" | "practicing" | "mastered" | null;
  masteryPct: number | null;
};

type Question = { question: string; expectedAnswer: string };

type Validation = {
  verdict: "mastered" | "practicing" | "discovering";
  feedback: string;
  masteryPct: number;
};

export function SkillChecklist({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  return (
    <section className="ph-panel ph-rivets relative overflow-hidden">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <header className="ph-station-header flex items-center justify-between px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
          Compétences à valider ({skills.length})
        </span>
        <span className="ph-ref">SKILLS</span>
      </header>
      <ul className="divide-y divide-[var(--color-border-subtle)]">
        {skills.map((s, i) => (
          <SkillRow key={s.id} skill={s} index={i} />
        ))}
      </ul>
    </section>
  );
}

function SkillRow({ skill, index }: { skill: Skill; index: number }) {
  const [status, setStatus] = useState<Skill["status"]>(skill.status);
  const [checking, setChecking] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validation, setValidation] = useState<Validation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMastered = status === "mastered";

  async function handleCheck() {
    if (isMastered) return;
    setError(null);
    setChecking(true);
    setValidation(null);
    try {
      const q = await apiFetch<Question>(`/api/skills/${skill.id}/check`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setQuestion(q);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur génération question";
      setError(msg);
    } finally {
      setChecking(false);
    }
  }

  async function handleValidate() {
    if (!question) return;
    if (answer.trim().length === 0) {
      setError("Ta réponse est vide.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const v = await apiFetch<Validation>(`/api/skills/${skill.id}/validate`, {
        method: "POST",
        body: JSON.stringify({
          question: question.question,
          expectedAnswer: question.expectedAnswer,
          userAnswer: answer,
        }),
      });
      setValidation(v);
      setStatus(v.verdict);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur validation";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setQuestion(null);
    setAnswer("");
    setValidation(null);
    setError(null);
  }

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={isMastered || checking}
          aria-label={isMastered ? "Compétence validée" : "Valider cette compétence"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition ${
            isMastered
              ? "border-[var(--color-success)] bg-[var(--color-success)]"
              : "border-[var(--color-border-strong)] hover:border-[var(--color-accent)]"
          } disabled:cursor-not-allowed`}
          style={{ borderRadius: 2 }}
        >
          {isMastered && (
            <span className="text-[var(--color-bg-base)] text-xs font-bold">✓</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={`text-sm leading-snug ${isMastered ? "text-[var(--color-fg-muted)] line-through" : "text-[var(--color-fg-primary)]"}`}
            >
              <span className="mr-2 font-mono text-[10px] text-[var(--color-fg-muted)] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              {skill.label}
            </p>
            {status && status !== "mastered" && (
              <span className="ph-ref shrink-0">{status === "practicing" ? "en pratique" : "à creuser"}</span>
            )}
          </div>

          <SkillVideos videos={skill.videos ?? []} skillLabel={skill.label} />

          {/* Question + réponse en mode déplié */}
          {question && !validation && (
            <div className="mt-3 rounded border-2 border-[var(--color-accent)] bg-[var(--color-bg-base)] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                Question de validation
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed">
                {question.question}
              </p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitting}
                spellCheck={false}
                rows={4}
                className="mt-3 block w-full resize-y rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-2 font-mono text-sm leading-relaxed text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
                placeholder="Ta réponse…"
                autoFocus
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={reset}
                  disabled={submitting}
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                >
                  annuler
                </button>
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={submitting || answer.trim().length === 0}
                  className="border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "vérification…" : "▶ valider"}
                </button>
              </div>
            </div>
          )}

          {/* Verdict */}
          {validation && (
            <div
              className={`mt-3 rounded border-2 p-3 ${
                validation.verdict === "mastered"
                  ? "border-[var(--color-success)] bg-[var(--color-bg-base)]"
                  : validation.verdict === "practicing"
                    ? "border-[var(--color-warning)] bg-[var(--color-bg-base)]"
                    : "border-[var(--color-danger)] bg-[var(--color-bg-base)]"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <p
                  className={`font-mono text-xs font-bold uppercase tracking-widest ${
                    validation.verdict === "mastered"
                      ? "text-[var(--color-success)]"
                      : validation.verdict === "practicing"
                        ? "text-[var(--color-warning)]"
                        : "text-[var(--color-danger)]"
                  }`}
                >
                  {validation.verdict === "mastered"
                    ? "✓ Acquis"
                    : validation.verdict === "practicing"
                      ? "≈ À retravailler"
                      : "✗ Non acquis"}
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
                  onClick={reset}
                  className="mt-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] hover:underline"
                >
                  retenter →
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          )}

          {checking && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              génération de la question…
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
