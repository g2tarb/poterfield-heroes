"use client";

import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[porterfield] route error:", error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center bg-[var(--color-bg-base)] px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <p
          className="ph-loader-title font-mono text-3xl font-bold uppercase tracking-tight sm:text-4xl"
          data-text="error"
        >
          error
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          // une route a planté
        </p>
        <pre className="mt-6 max-h-40 overflow-auto rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-3 text-left font-mono text-[11px] text-[var(--color-fg-muted)]">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[40px] items-center border-2 border-[var(--color-accent)] px-4 text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/10 active:bg-[var(--color-accent)]/20"
          >
            ↻ retry
          </button>
          <a
            href="/"
            className="inline-flex min-h-[40px] items-center border border-[var(--color-border-strong)] px-4 text-xs font-mono uppercase tracking-widest text-[var(--color-fg-muted)] transition hover:border-[var(--color-fg-primary)] hover:text-[var(--color-fg-primary)]"
          >
            ← atelier
          </a>
        </div>
      </div>
    </main>
  );
}
