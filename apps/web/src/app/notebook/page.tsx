import { NotebookClient } from "@/components/notebook/NotebookClient";
import { CoachPanel } from "@/components/coach/CoachPanel";
import Link from "next/link";

export const metadata = { title: "Carnet" };

export default function NotebookPage() {
  return (
    <>
      <main className="min-h-svh px-6 py-12 md:px-12 lg:px-24">
        <nav className="mb-8 font-mono text-xs">
          <Link
            href="/"
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
          >
            ← Accueil
          </Link>
        </nav>

        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            Carnet
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Tes notes, vivantes.
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Markdown. Indexées automatiquement pour que le coach les retrouve
            quand tu poses une question. Source <code>user</code> pour tes notes
            libres, <code>coach</code> pour les entrées validées depuis une
            réponse du coach, <code>system</code> pour les pièges classiques
            préformatés.
          </p>
        </header>

        <NotebookClient />
      </main>
      <CoachPanel />
    </>
  );
}
