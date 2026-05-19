"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ph_onboarding_seen_v1";

type Step = {
  title: string;
  body: string;
  hint: string;
};

const STEPS: Step[] = [
  {
    title: "L'atelier",
    body: "Tu vois 25 modules en escalier. Tu commences au premier non-verrouillé. Chaque module = vidéos + skills + exos + projet.",
    hint: "▼ Clique le module actif pour commencer",
  },
  {
    title: "Le coach",
    body: "À tout moment, ouvre le drawer à droite. Le coach connaît ton module en cours, ton carnet, ta progression. Pose-lui n'importe quoi.",
    hint: "→ Bouton flottant coin bas-droit",
  },
  {
    title: "Code Noir",
    body: "Zone secrète. Tire la page vers le bas depuis le haut pendant 3 secondes pour la débloquer. Sécurité offensive/défensive.",
    hint: "↓ Pull-to-reveal en haut de page",
  },
];

export function OnboardingTip() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    setOpen(true);
  }, []);

  if (!open) return null;

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:bottom-6 sm:px-6">
      <div className="mx-auto max-w-xl rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-bg-elev)]/95 p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            // intro · {step + 1}/{STEPS.length}
          </p>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            aria-label="Fermer l'intro"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-lg font-semibold text-[var(--color-fg-primary)]">
          {current.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-secondary)]">
          {current.body}
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)]">
          {current.hint}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition ${
                  i === step
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border)]"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex min-h-[40px] items-center border border-[var(--color-border)] px-3 text-xs font-mono uppercase tracking-widest text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg-primary)]"
              >
                ← prev
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? close() : setStep((s) => s + 1))}
              className="inline-flex min-h-[40px] items-center border-2 border-[var(--color-accent)] px-3 text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/10"
            >
              {isLast ? "✓ compris" : "suivant →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
