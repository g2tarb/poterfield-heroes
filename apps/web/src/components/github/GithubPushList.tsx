"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/coach/Markdown";

type PushRow = {
  id: string;
  branch: string;
  headSha: string;
  commitsCount: number;
  detectedAt: string;
  reviewCompletedAt: string | null;
  repoFullName: string;
};

type PushDetail = {
  push: PushRow & {
    commitsPayload: Array<{ id: string; message: string }> | null;
  };
  review: {
    overallSeverity: "info" | "suggestion" | "warning" | "critical";
    overallSummary: string;
    annotations: Array<{
      file: string;
      line: number;
      severity: "info" | "suggestion" | "warning" | "critical";
      message: string;
      suggestedFix?: string;
    }>;
    criteriaScores: Record<string, number>;
  } | null;
};

const SEVERITY_COLOR = {
  info: "var(--color-fg-secondary)",
  suggestion: "var(--color-accent)",
  warning: "var(--color-warning)",
  critical: "var(--color-danger)",
} as const;

export function GithubPushList() {
  const [pushes, setPushes] = useState<PushRow[] | null>(null);
  const [selected, setSelected] = useState<PushDetail | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await apiFetch<PushRow[]>("/api/github/pushes");
        setPushes(rows);
      } catch {
        setPushes([]);
      }
    })();
  }, []);

  async function open(id: string) {
    try {
      const detail = await apiFetch<PushDetail>(`/api/github/pushes/${id}`);
      setSelected(detail);
    } catch (e) {
      console.error(e);
    }
  }

  if (!pushes) {
    return <p className="text-[var(--color-fg-muted)]">Chargement…</p>;
  }

  if (pushes.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6">
        <p className="font-semibold">Aucun push détecté pour l&apos;instant.</p>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Configure le webhook GitHub vers cette URL et push sur un repo lié à un
          module pour déclencher une review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[360px_1fr]">
      <ul className="space-y-2">
        {pushes.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => open(p.id)}
              className={cn(
                "w-full rounded-md border bg-[var(--color-bg-elevated)] p-3 text-left transition",
                selected?.push.id === p.id
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <p className="font-mono text-xs text-[var(--color-fg-muted)]">
                {p.repoFullName}@{p.branch}
              </p>
              <p className="mt-1 truncate text-sm">
                {p.headSha.slice(0, 8)} · {p.commitsCount} commits
              </p>
              <p className="mt-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
                {new Date(p.detectedAt).toLocaleString("fr-FR")} ·{" "}
                {p.reviewCompletedAt ? "review prête" : "en cours…"}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <section className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
        {!selected ? (
          <p className="text-[var(--color-fg-muted)]">
            Sélectionne un push pour voir la review.
          </p>
        ) : !selected.review ? (
          <p className="text-[var(--color-fg-muted)]">
            Review en cours, recharge dans quelques secondes.
          </p>
        ) : (
          <>
            <header className="mb-4">
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{
                  color: SEVERITY_COLOR[selected.review.overallSeverity],
                }}
              >
                {selected.review.overallSeverity}
              </p>
              <div className="prose-coach mt-2">
                <Markdown source={selected.review.overallSummary} />
              </div>
            </header>

            <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {Object.entries(selected.review.criteriaScores).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-2"
                >
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                    {k}
                  </p>
                  <p className="mt-1 font-mono text-base tabular-nums">{v}</p>
                </div>
              ))}
            </div>

            <h4 className="mb-2 text-sm font-semibold">
              Annotations ({selected.review.annotations.length})
            </h4>
            <ul className="space-y-2">
              {selected.review.annotations.map((a, i) => (
                <li
                  key={i}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3"
                  style={{
                    borderLeftColor: SEVERITY_COLOR[a.severity],
                    borderLeftWidth: 3,
                  }}
                >
                  <p className="font-mono text-[10px] text-[var(--color-fg-muted)]">
                    {a.file}:{a.line} · {a.severity}
                  </p>
                  <p className="mt-1 text-sm">{a.message}</p>
                  {a.suggestedFix && (
                    <pre className="mt-2 overflow-x-auto rounded bg-[var(--color-bg-high)] p-2 font-mono text-xs">
                      {a.suggestedFix}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
