"use client";

import { useEffect, useRef, useState } from "react";

const SNIPPETS = [
  "const fetch = async (url) => await (await fetch(url)).json()",
  "<!DOCTYPE html>",
  "document.querySelector('.hero').addEventListener('click', ...)",
  "function debounce(fn, ms) { let t; return (...a) => { ... } }",
  "useEffect(() => { return () => cleanup(); }, [deps])",
  "SELECT * FROM users WHERE created_at > NOW() - interval '7d'",
  "git rebase -i HEAD~3",
  "type User = { id: string; email: string; created: Date }",
  "Promise.all([fetch(a), fetch(b)]).then(...)",
  "@media (prefers-reduced-motion: reduce) { ... }",
  "export default async function Page() { ... }",
  "fastify.post('/login', { schema }, handler)",
  "CREATE INDEX idx_users_email ON users (email)",
  "const [state, setState] = useState<User | null>(null)",
  "DROP TABLE IF EXISTS sessions CASCADE",
  "npm run build && npm run start",
  "if (!response.ok) throw new ApiError(response.status)",
  "FROM node:22-alpine AS runtime",
  "addEventListener('beforeunload', (e) => e.preventDefault())",
  "interface Repository<T> { find(id: string): Promise<T | null> }",
  "useMemo(() => expensiveCompute(data), [data])",
  "const { rows } = await db.query('SELECT ... ')",
  "z.object({ email: z.string().email() })",
  "for await (const chunk of stream) { ... }",
  "Object.freeze(config)",
  "new Worker(new URL('./worker.js', import.meta.url))",
  "matrix.translate(x, y).rotate(theta).scale(s)",
  "WeakMap<Element, Subscription>()",
  "AbortController() // → controller.signal",
  "git commit -m 'feat: lift off 🚀'",
];

type Line = {
  id: number;
  text: string;
  top: number;
  duration: number;
  delay: number;
  fadeDuration: number;
  depth: number;
};

export function CodeRain() {
  const [lines, setLines] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Génère 18 lignes, depth variable (0.3 = profondeur, 1.8 = premier plan)
    const generated: Line[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)] ?? "",
      top: Math.random() * 100,
      duration: 35 + Math.random() * 55,
      delay: Math.random() * -80,
      fadeDuration: 10 + Math.random() * 8,
      depth: 0.3 + Math.random() * 1.5,
    }));
    setLines(generated);
  }, []);

  // Parallax au curseur — lerp pour mouvement fluide
  useEffect(() => {
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
  }, []);

  return (
    <div ref={containerRef} className="ph-code-bg" aria-hidden>
      {lines.map((line) => (
        <div
          key={line.id}
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
