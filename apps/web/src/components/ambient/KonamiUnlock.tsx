"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiUnlock() {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[i]) {
        i++;
        setProgress(i);
        if (i === SEQUENCE.length) {
          setRevealed(true);
          i = 0;
          setProgress(0);
        }
      } else {
        i = key === SEQUENCE[0] ? 1 : 0;
        setProgress(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!revealed && progress < 4) return null;

  if (revealed) {
    return (
      <div
        className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded border-2 border-[#00ff88] bg-black px-4 py-3 font-mono text-sm text-[#00ff88] shadow-[0_0_24px_rgba(0,255,136,0.4)]"
        role="status"
      >
        <span className="uppercase tracking-widest">
          ╳ CODE NOIR débloqué
        </span>
        <button
          type="button"
          onClick={() => router.push("/code-noir")}
          className="border border-[#00ff88] px-3 py-1 text-xs uppercase tracking-widest hover:bg-[rgba(0,255,136,0.1)]"
        >
          entrer
        </button>
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="text-xs opacity-70 hover:opacity-100"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    );
  }

  // Indicateur subtil au-delà de 4 keys matchées
  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-40 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] opacity-50">
      {progress}/{SEQUENCE.length}
    </div>
  );
}
