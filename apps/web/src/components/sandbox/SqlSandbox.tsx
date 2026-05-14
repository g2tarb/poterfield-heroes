"use client";

import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { usePgliteRunner } from "./usePgliteRunner";

const DEFAULT_SQL = `-- Postgres in-browser (PGlite, ~3MB WASM).
-- La DB est éphémère : recharge la page = reset complet.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT
);

INSERT INTO users (name, age) VALUES
  ('Alice', 30),
  ('Bob', 25),
  ('Carol', 42)
ON CONFLICT DO NOTHING;

SELECT * FROM users ORDER BY age DESC;
`;

type Props = {
  initialSql?: string;
  title?: string;
};

export function SqlSandbox({ initialSql = DEFAULT_SQL, title }: Props) {
  const [code, setCode] = useState(initialSql);
  const { run, clear, result, error, running, loadingStage } = usePgliteRunner();

  return (
    <div className="flex h-[600px] flex-col gap-2 md:h-[500px]">
      {title && (
        <div className="flex items-baseline justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            {title}
          </h3>
          {result && (
            <span className="font-mono text-xs text-[var(--color-fg-muted)]">
              {result.durationMs}ms · {result.rows.length} rows
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 flex-1 min-h-0 md:grid-cols-2">
        {/* Editor */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-mono uppercase tracking-wider text-[var(--color-fg-muted)] rounded-t-md">
            <span>SQL · PGlite</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => run(code)}
                disabled={running}
                className="rounded bg-[var(--color-accent)] px-2.5 py-1 text-[var(--color-accent-fg)] disabled:opacity-40"
              >
                {running ? "Run…" : "Exécuter ▸"}
              </button>
              <button
                type="button"
                onClick={clear}
                className="rounded border border-[var(--color-border-strong)] px-2.5 py-1 hover:border-[var(--color-fg-primary)]"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor value={code} onChange={setCode} language="javascript" />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col min-h-0 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
          <div className="border-b border-[var(--color-border-subtle)] px-3 py-2 text-xs font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">
            Résultat
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3 font-mono text-xs">
            {loadingStage && (
              <p className="italic text-[var(--color-fg-muted)]">
                {loadingStage}
              </p>
            )}
            {error && (
              <pre className="whitespace-pre-wrap text-[var(--color-danger)]">
                {error}
              </pre>
            )}
            {!error && !loadingStage && !result && (
              <p className="text-[var(--color-fg-muted)]">
                Lance une requête pour voir les résultats.
              </p>
            )}
            {result && result.rows.length > 0 && (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-fg-muted)]">
                    {result.fields.map((f) => (
                      <th key={f.name} className="px-2 py-1 font-semibold">
                        {f.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--color-border-subtle)]"
                    >
                      {result.fields.map((f) => (
                        <td key={f.name} className="px-2 py-1">
                          {String(row[f.name] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {result && result.rows.length === 0 && (
              <p className="text-[var(--color-fg-secondary)]">
                {result.affectedRows !== undefined
                  ? `${result.affectedRows} ligne(s) affectée(s)`
                  : "Aucune ligne retournée."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
