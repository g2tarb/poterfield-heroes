"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";
import { useSandboxRunner, type LogEntry } from "@/components/sandbox/useSandboxRunner";
import { usePyodideRunner } from "@/components/sandbox/usePyodideRunner";

export type LabStepTarget =
  | "read"
  | "browser-js"
  | "browser-python"
  | "docker-bash"
  | "docker-c";

export type LabStep = {
  n: number;
  title: string;
  goal: string;
  explain: string;
  target: LabStepTarget;
  code?: string;
  expected?: string;
};

const TARGET_LABEL: Record<LabStepTarget, string> = {
  read: "LECTURE",
  "browser-js": "JS · navigateur",
  "browser-python": "PYTHON · navigateur",
  "docker-bash": "BASH · sandbox Docker",
  "docker-c": "C · sandbox Docker",
};

function Console({ logs, running, note }: { logs: LogEntry[]; running: boolean; note?: string }) {
  return (
    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap border border-[rgba(0,255,136,0.2)] bg-black/60 p-3 font-mono text-xs leading-relaxed">
      {logs.length === 0 && !running && (
        <span className="text-[rgba(0,255,136,0.35)]">{note ?? "— sortie —"}</span>
      )}
      {logs.map((l) => (
        <div
          key={l.id}
          className={
            l.kind === "error"
              ? "text-red-400"
              : l.kind === "warn"
                ? "text-yellow-400"
                : l.kind === "result"
                  ? "text-[#00ff88]"
                  : "text-[rgba(0,255,136,0.85)]"
          }
        >
          {l.text}
        </div>
      ))}
      {running && <span className="text-[rgba(0,255,136,0.5)]">▌</span>}
    </pre>
  );
}

function JsRunner({ code }: { code: string }) {
  const { run, logs, running } = useSandboxRunner();
  useEffect(() => {
    run(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <button
        type="button"
        onClick={() => run(code)}
        disabled={running}
        className="mb-1 border border-[rgba(0,255,136,0.4)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.8)] transition hover:bg-[rgba(0,255,136,0.08)] disabled:opacity-40"
      >
        {running ? "exécution…" : "↻ relancer"}
      </button>
      <Console logs={logs} running={running} />
    </div>
  );
}

function PyRunner({ code }: { code: string }) {
  const { run, logs, running, loadingStage } = usePyodideRunner();
  useEffect(() => {
    run(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <button
        type="button"
        onClick={() => run(code)}
        disabled={running}
        className="mb-1 border border-[rgba(0,255,136,0.4)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.8)] transition hover:bg-[rgba(0,255,136,0.08)] disabled:opacity-40"
      >
        {running ? "exécution…" : "↻ relancer"}
      </button>
      <Console
        logs={logs}
        running={running}
        note={loadingStage ? `Chargement Python (${loadingStage})…` : undefined}
      />
    </div>
  );
}

type DockerRunResult = {
  ok: boolean;
  output?: string;
  error?: string;
  available?: boolean;
};

function DockerRunner({ target, code }: { target: LabStepTarget; code: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setLogs([{ id: "sys", kind: "system", text: "→ envoi au conteneur lab…", ts: Date.now() }]);
    try {
      const res = await apiFetch<DockerRunResult>("/sandbox/run", {
        method: "POST",
        body: JSON.stringify({
          language: target === "docker-c" ? "c" : "bash",
          code,
        }),
      });
      if (res.available === false) {
        setLogs([
          {
            id: "na",
            kind: "warn",
            text:
              "Sandbox Docker indisponible. Démarre le runtime :\n  brew install colima docker && colima start --cpu 2 --memory 2\npuis relance cette étape.",
            ts: Date.now(),
          },
        ]);
      } else {
        setLogs([
          {
            id: "out",
            kind: res.ok ? "result" : "error",
            text: (res.output ?? "") + (res.error ? `\n${res.error}` : ""),
            ts: Date.now(),
          },
        ]);
      }
    } catch (e) {
      setLogs([
        {
          id: "err",
          kind: "error",
          text: e instanceof Error ? e.message : "Échec de l'exécution",
          ts: Date.now(),
        },
      ]);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => void run()}
        disabled={running}
        className="mb-1 border border-[rgba(0,255,136,0.4)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.8)] transition hover:bg-[rgba(0,255,136,0.08)] disabled:opacity-40"
      >
        {running ? "exécution…" : "↻ relancer"}
      </button>
      <Console logs={logs} running={running} note="— sortie du conteneur —" />
    </div>
  );
}

function Runner({ target, code }: { target: LabStepTarget; code: string }) {
  if (target === "browser-js") return <JsRunner code={code} />;
  if (target === "browser-python") return <PyRunner code={code} />;
  return <DockerRunner target={target} code={code} />;
}

function LabStepCard({ step }: { step: LabStep }) {
  const [armed, setArmed] = useState(false);
  const runnable = step.target !== "read" && !!step.code;

  return (
    <div className="border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.02)] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.55)]">
          Étape {step.n} · {step.title}
        </p>
        <span className="shrink-0 border border-[rgba(0,255,136,0.3)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
          {TARGET_LABEL[step.target]}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-[rgba(0,255,136,0.9)]">{step.goal}</p>

      <div className="mt-2 text-sm leading-relaxed text-[rgba(255,255,255,0.78)] [&_code]:text-[#00ff88]">
        <Markdown source={step.explain} />
      </div>

      {runnable && (
        <div className="mt-3">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap border border-[rgba(0,255,136,0.15)] bg-black/50 p-3 font-mono text-xs text-[rgba(0,255,136,0.85)]">
            {step.code}
          </pre>
          {!armed ? (
            <button
              type="button"
              onClick={() => setArmed(true)}
              className="ph-noir-glow mt-2 border-2 border-[#00ff88] bg-[rgba(0,255,136,0.08)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.18)]"
            >
              ▶ Lancer dans le sandbox
            </button>
          ) : (
            <div className="mt-2">
              <Runner target={step.target} code={step.code!} />
            </div>
          )}
          {step.expected && (
            <details className="mt-2">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
                ▸ résultat attendu
              </summary>
              <pre className="mt-1 whitespace-pre-wrap border border-[rgba(0,255,136,0.15)] bg-black/40 p-2 font-mono text-[11px] text-[rgba(0,255,136,0.7)]">
                {step.expected}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export function CodeNoirLab({ steps }: { steps: LabStep[] | undefined }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="border border-[rgba(0,255,136,0.2)] bg-black/40 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
          Lab en préparation pour cette technique.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="border border-[rgba(255,200,0,0.3)] bg-[rgba(255,200,0,0.05)] p-3">
        <p className="font-mono text-[11px] leading-relaxed text-[rgba(255,200,0,0.85)]">
          🔒 Cadre légal — ce lab s'exécute dans un environnement isolé et jetable
          (navigateur ou conteneur sans réseau). Reproduis ces techniques UNIQUEMENT
          ici ou sur des cibles que tu possèdes / autorisées.
        </p>
      </div>
      {steps
        .slice()
        .sort((a, b) => a.n - b.n)
        .map((s) => (
          <LabStepCard key={s.n} step={s} />
        ))}
    </div>
  );
}
