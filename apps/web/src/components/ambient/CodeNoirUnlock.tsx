"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PULL_DURATION_MS = 3000;

export function CodeNoirUnlock() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const pullingRef = useRef(false);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const stopPull = () => {
      pullingRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setProgress(0);
    };

    const tick = () => {
      if (!pullingRef.current) return;
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / PULL_DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= PULL_DURATION_MS) {
        setRevealed(true);
        stopPull();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const startPull = () => {
      if (pullingRef.current || revealed) return;
      pullingRef.current = true;
      startRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    // Desktop: wheel up alors qu'on est déjà tout en haut
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        startPull();
      } else if (e.deltaY > 0) {
        stopPull();
      }
    };

    // Mobile: touch qui essaie de tirer la page vers le bas (= scroll up)
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) touchStartY = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const movingDown = t.clientY > touchStartY + 20;
      if (window.scrollY <= 0 && movingDown) {
        startPull();
      } else if (t.clientY < touchStartY - 10) {
        stopPull();
      }
    };
    const onTouchEnd = () => stopPull();

    // Si on commence à scroller normalement vers le bas, on annule
    const onScroll = () => {
      if (window.scrollY > 0) stopPull();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
    };
  }, [revealed]);

  // Toast quand débloqué
  if (revealed) {
    return (
      <div
        className="fixed inset-x-2 z-50 mx-auto flex max-w-md flex-wrap items-center justify-between gap-2 rounded border-2 border-[#00ff88] bg-black px-3 py-3 font-mono text-sm text-[#00ff88] shadow-[0_0_24px_rgba(0,255,136,0.4)] sm:inset-x-0 sm:gap-3 sm:px-4"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 12px)",
        }}
        role="status"
      >
        <span className="flex-1 text-xs uppercase tracking-widest sm:text-sm">
          ╳ CODE NOIR débloqué
        </span>
        <button
          type="button"
          onClick={() => router.push("/code-noir")}
          className="inline-flex min-h-[40px] items-center border border-[#00ff88] px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-[rgba(0,255,136,0.1)] active:bg-[rgba(0,255,136,0.2)]"
        >
          entrer
        </button>
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center text-base opacity-70 hover:opacity-100 active:opacity-100"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    );
  }

  // Indicateur visuel pendant le pull (barre en haut)
  if (progress > 0) {
    const seconds = Math.ceil((PULL_DURATION_MS - (progress / 100) * PULL_DURATION_MS) / 1000);
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className="h-1 bg-[#00ff88] transition-all duration-100"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 12px rgba(0,255,136,0.6)",
          }}
        />
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-[#00ff88] [text-shadow:0_0_8px_rgba(0,255,136,0.5)]">
          ╳ code noir · {seconds}s
        </p>
      </div>
    );
  }

  return null;
}
