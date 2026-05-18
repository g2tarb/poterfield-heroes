"use client";

import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { useSandboxRunner } from "./useSandboxRunner";
import { usePyodideRunner } from "./usePyodideRunner";
import { cn } from "@/lib/cn";

type Language = "javascript" | "typescript" | "python";

type Props = {
  initialCode?: string;
  language?: Language;
  title?: string;
  allowLanguageSwitch?: boolean;
};

const DEFAULT_CODE_BY_LANG: Record<Language, string> = {
  javascript: `// Sandbox JavaScript isolée (Web Worker, timeout 5s).
const greet = (name) => \`Hello \${name}\`;
console.log(greet("Erwin"));
return greet("World");
`,
  typescript: `// Sandbox TypeScript (annotations strippées au runtime).
const greet = (name: string): string => \`Hello \${name}\`;
console.log(greet("Erwin"));
`,
  python: `# Sandbox Python via Pyodide (Web Worker, WASM).
# Premier run = ~6 MB téléchargés. Suivants : instantané.

def greet(name: str) -> str:
    return f"Hello {name}"

print(greet("Erwin"))
greet("World")
`,
};

export function Sandbox({
  initialCode,
  language: initialLang = "javascript",
  title,
  allowLanguageSwitch = true,
}: Props) {
  const [language, setLanguage] = useState<Language>(initialLang);
  const [code, setCode] = useState(
    initialCode ?? DEFAULT_CODE_BY_LANG[initialLang],
  );

  const js = useSandboxRunner();
  const py = usePyodideRunner();
  const isPy = language === "python";
  const runner = isPy ? py : js;
  const { logs, running, durationMs } = runner;

  function handleRun() {
    if (isPy) py.run(code);
    else js.run(code, language === "typescript" ? "typescript" : "javascript");
  }
  function handleStop() {
    if (isPy) py.stop();
    else js.stop();
  }
  function handleClear() {
    if (isPy) py.clear();
    else js.clear();
  }
  function handleLangChange(next: Language) {
    setLanguage(next);
    setCode(DEFAULT_CODE_BY_LANG[next]);
  }

  return (
    <div className="flex h-[600px] flex-col gap-2 md:h-[500px]">
      {title && (
        <div className="flex items-baseline justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            {title}
          </h3>
          {durationMs !== null && !running && (
            <span className="font-mono text-xs text-[var(--color-fg-muted)]">
              {durationMs}ms
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 flex-1 min-h-0 md:grid-cols-2">
        {/* Editor */}
        <div className="ph-panel flex flex-col min-h-0 overflow-hidden">
          <div className="ph-station-header flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
            {allowLanguageSwitch ? (
              <select
                value={language}
                onChange={(e) => handleLangChange(e.target.value as Language)}
                disabled={running}
                className="bg-transparent text-[var(--color-fg-muted)] focus:outline-none disabled:opacity-50"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            ) : (
              <span>{language}</span>
            )}
            <div className="flex items-center gap-2">
              {durationMs !== null && !running && (
                <span className="font-mono text-[10px] tabular-nums text-[var(--color-success)]">
                  ✓ {durationMs}ms
                </span>
              )}
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-fg)] transition active:scale-95 disabled:opacity-40"
              >
                {running ? "● Run…" : "▶ Run"}
              </button>
              {running && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>
        </div>

        {/* Console */}
        <div className="ph-panel flex flex-col min-h-0 overflow-hidden">
          <div className="ph-station-header flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--color-fg-secondary)]">
            <span>Console</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] hover:text-[var(--color-fg-primary)]"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3 font-mono text-xs leading-relaxed">
            {logs.length === 0 && !running && (
              <p className="text-[var(--color-fg-muted)]">
                Lance le code pour voir l&apos;output ici.
              </p>
            )}
            {logs.map((l) => (
              <pre
                key={l.id}
                className={cn(
                  "whitespace-pre-wrap break-words",
                  l.kind === "error" && "text-[var(--color-danger)]",
                  l.kind === "warn" && "text-[var(--color-warning)]",
                  l.kind === "result" && "text-[var(--color-accent)]",
                  l.kind === "system" && "text-[var(--color-fg-muted)] italic",
                  (l.kind === "log" || l.kind === "info") &&
                    "text-[var(--color-fg-primary)]",
                )}
              >
                {l.text}
              </pre>
            ))}
            {running && (
              <p className="mt-1 text-[var(--color-fg-muted)] italic">
                Exécution…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
