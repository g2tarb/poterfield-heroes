"use client";

import { useEffect, useState } from "react";

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
  "console.assert(x > 0, 'x must be positive')",
  "for await (const chunk of stream) { ... }",
  "Object.freeze(config)",
  "new Worker(new URL('./worker.js', import.meta.url))",
  "matrix.translate(x, y).rotate(theta).scale(s)",
  "WeakMap<Element, Subscription>()",
  "AbortController() // → controller.signal",
];

type Line = {
  id: number;
  text: string;
  top: number;
  duration: number;
  delay: number;
  fadeDuration: number;
};

export function CodeRain() {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    // Génère 14 lignes positionnées aléatoirement avec durées variées
    const generated: Line[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)] ?? "",
      top: Math.random() * 100,
      duration: 40 + Math.random() * 50,
      delay: Math.random() * -60,
      fadeDuration: 12 + Math.random() * 8,
    }));
    setLines(generated);
  }, []);

  return (
    <div className="ph-code-bg" aria-hidden>
      {lines.map((line) => (
        <div
          key={line.id}
          className="ph-code-bg-line"
          style={{
            top: `${line.top}%`,
            animationDuration: `${line.duration}s, ${line.fadeDuration}s`,
            animationDelay: `${line.delay}s, ${line.delay}s`,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
