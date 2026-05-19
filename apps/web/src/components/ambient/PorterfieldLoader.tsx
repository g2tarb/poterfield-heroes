"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> porterfield.init()",
  "> [boot] connecting db...",
  "> [boot] hydrating modules...",
  "> [boot] loading coach context...",
  "> [boot] preparing rag retrieval...",
  "> [ok] atelier ready",
];

type Props = {
  /** Plein écran (loading.tsx Next.js) ou inline (skeleton) */
  fullscreen?: boolean;
  /** Texte personnalisé sous le titre (override BOOT_LINES) */
  label?: string;
  /** Taille du titre */
  size?: "sm" | "md" | "lg";
};

export function PorterfieldLoader({
  fullscreen = false,
  label,
  size = "md",
}: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (label) return; // pas d'animation si label fixe
    const id = setInterval(() => {
      setStep((s) => (s + 1) % BOOT_LINES.length);
    }, 420);
    return () => clearInterval(id);
  }, [label]);

  const titleSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl";

  const inner = (
    <div className="text-center">
      <p
        className={`ph-loader-title font-bold uppercase tracking-tight ${titleSize}`}
        data-text="porterfield"
      >
        porterfield
        <span className="ph-loader-cursor" aria-hidden />
      </p>
      <p className="mt-3 font-mono text-xs text-[var(--color-fg-muted)] sm:text-sm">
        {label ?? BOOT_LINES[step] ?? BOOT_LINES[0]}
      </p>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-bg-base)]"
        role="status"
        aria-live="polite"
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      className="grid place-items-center py-12 sm:py-16"
      role="status"
      aria-live="polite"
    >
      {inner}
    </div>
  );
}

/**
 * Version compacte pour les chargements de zones (cards, sidebars).
 * Plus discret qu'un fullscreen loader.
 */
export function PorterfieldSpinner({ label }: { label?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 180);
    return () => clearInterval(id);
  }, []);

  const chars = ["⠋", "⠙", "⠹", "⠸"];

  return (
    <div
      className="flex items-center gap-2 font-mono text-xs text-[var(--color-fg-muted)]"
      role="status"
      aria-live="polite"
    >
      <span className="text-[var(--color-accent)]">{chars[step]}</span>
      <span>{label ?? "porterfield"}</span>
      <span className="ph-loader-cursor h-3" style={{ width: "0.4em" }} aria-hidden />
    </div>
  );
}
