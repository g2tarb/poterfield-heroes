"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/": "Atelier",
  "/notebook": "Carnet",
  "/stats": "Stats",
  "/settings": "Réglages",
  "/srs": "Révisions",
  "/sandbox": "Sandbox",
  "/github": "GitHub",
  "/exams": "Examens",
  "/exams/current": "Examen",
  "/code-noir": "Code Noir",
};

function deriveTitle(pathname: string): string {
  if (pathname.startsWith("/modules/")) return "Module";
  if (pathname.startsWith("/p/")) return "Vitrine";
  if (pathname.startsWith("/exams/")) return "Examen";
  return TITLES[pathname] ?? "Porterfield";
}

export function TopBar() {
  const pathname = usePathname() ?? "/";
  const isRoot = pathname === "/";
  const title = deriveTitle(pathname);

  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/95 backdrop-blur-xl pt-[env(safe-area-inset-top)] lg:hidden"
      role="banner"
    >
      <div className="flex h-12 items-center justify-between px-4">
        {isRoot ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
            Porterfield
          </span>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            aria-label="Retour à l'atelier"
          >
            <span aria-hidden>←</span>
            <span>Atelier</span>
          </Link>
        )}
        <h1 className="text-sm font-semibold">{title}</h1>
        <span className="w-12" aria-hidden />
      </div>
    </header>
  );
}
