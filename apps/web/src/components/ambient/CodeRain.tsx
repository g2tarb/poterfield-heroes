"use client";

import { useEffect, useRef, useState } from "react";
import { getSnippetsForModule } from "@/lib/moduleSnippets";
import { useFocusedModule } from "./FocusedModuleContext";

type Line = {
  id: number;
  text: string;
  top: number;
  duration: number;
  delay: number;
  fadeDuration: number;
  depth: number;
};

const LINE_COUNT = 18;

function generateLines(snippets: string[]): Line[] {
  return Array.from({ length: LINE_COUNT }).map((_, i) => ({
    id: i,
    text: snippets[Math.floor(Math.random() * snippets.length)] ?? "",
    top: Math.random() * 100,
    duration: 35 + Math.random() * 55,
    delay: Math.random() * -80,
    fadeDuration: 10 + Math.random() * 8,
    depth: 0.3 + Math.random() * 1.5,
  }));
}

export function CodeRain() {
  const { focused } = useFocusedModule();
  const [lines, setLines] = useState<Line[]>([]);
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Détecte mobile/touch pour skip uniquement le parallax mousemove
  // (les animations CSS restent actives)
  useEffect(() => {
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    setIsTouch(touch);
  }, []);

  // Re-génère les lignes quand le module focused change
  useEffect(() => {
    const snippets = getSnippetsForModule(focused);
    setLines(generateLines(snippets));
  }, [focused]);

  // Parallax au curseur — lerp pour mouvement fluide (desktop only,
  // sur mobile on garde les lignes animées mais sans tracking souris)
  useEffect(() => {
    if (isTouch) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      targetRef.current = { x, y };
      container.classList.add("is-active");
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      container.classList.remove("is-active");
    };

    const tick = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * 0.08;
      currentRef.current.y += dy * 0.08;
      container.style.setProperty("--mx", String(currentRef.current.x));
      container.style.setProperty("--my", String(currentRef.current.y));
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch]);

  return (
    <div ref={containerRef} className="ph-code-bg" aria-hidden>
      {lines.map((line) => (
        <div
          key={`${focused ?? "default"}-${line.id}`}
          className="ph-code-bg-line"
          style={
            {
              top: `${line.top}%`,
              animationDuration: `${line.duration}s, ${line.fadeDuration}s`,
              animationDelay: `${line.delay}s, ${line.delay}s`,
              "--depth": line.depth,
            } as React.CSSProperties
          }
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
