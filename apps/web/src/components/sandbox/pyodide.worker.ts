/// <reference lib="webworker" />

// Pyodide worker — charge le runtime Python en WASM depuis CDN, exécute du code.
// Coût initial : ~6 MB téléchargés au premier run. Cache navigateur ensuite.

type PyIncoming = { id: string; code: string };

type PyOutgoing =
  | { type: "log"; id: string; kind: "log" | "info" | "warn" | "error"; args: string[] }
  | { type: "loading"; id: string; stage: string }
  | { type: "done"; id: string; durationMs: number; result?: string }
  | { type: "error"; id: string; message: string; stack?: string };

const pyCtx = self as unknown as DedicatedWorkerGlobalScope;

const PYODIDE_VERSION = "0.27.0";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// pyodide global once loaded
type PyodideInstance = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched?: (s: string) => void }) => void;
  setStderr: (opts: { batched?: (s: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideInstance> | null = null;

async function getPyodide(id: string): Promise<PyodideInstance> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    const post = (stage: string) => {
      const msg: PyOutgoing = { type: "loading", id, stage };
      pyCtx.postMessage(msg);
    };
    post("Téléchargement de Pyodide…");

    // Load loader script
    importScripts(`${PYODIDE_INDEX_URL}pyodide.js`);

    post("Initialisation du runtime Python…");
    // @ts-expect-error global loadPyodide injected by the imported script
    const py = (await loadPyodide({ indexURL: PYODIDE_INDEX_URL })) as PyodideInstance;

    post("Prêt.");
    return py;
  })();

  return pyodidePromise;
}

pyCtx.onmessage = async (event: MessageEvent<PyIncoming>) => {
  const { id, code } = event.data;
  const start = performance.now();

  try {
    const py = await getPyodide(id);

    py.setStdout({
      batched: (line: string) => {
        const msg: PyOutgoing = {
          type: "log",
          id,
          kind: "log",
          args: [line],
        };
        pyCtx.postMessage(msg);
      },
    });
    py.setStderr({
      batched: (line: string) => {
        const msg: PyOutgoing = {
          type: "log",
          id,
          kind: "error",
          args: [line],
        };
        pyCtx.postMessage(msg);
      },
    });

    const result = await py.runPythonAsync(code);

    const durationMs = Math.round(performance.now() - start);
    const out: PyOutgoing = {
      type: "done",
      id,
      durationMs,
      ...(result !== undefined && result !== null
        ? { result: String(result) }
        : {}),
    };
    pyCtx.postMessage(out);
  } catch (err) {
    const e = err as Error;
    const out: PyOutgoing = {
      type: "error",
      id,
      message: e.message || String(err),
      ...(e.stack ? { stack: e.stack } : {}),
    };
    pyCtx.postMessage(out);
  }
};
