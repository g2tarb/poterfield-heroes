import { NotebookClient } from "@/components/notebook/NotebookClient";
import Link from "next/link";

export const metadata = { title: "Carnet" };

export default function NotebookPage() {
  return (
    <main className="min-h-svh px-3 pb-4 pt-3 sm:px-6 sm:pb-8 sm:pt-4 lg:px-12 lg:pt-12 xl:px-24">
      <nav className="mb-3 font-mono text-xs sm:mb-6">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Accueil
        </Link>
      </nav>

      <header className="mb-4 max-w-2xl sm:mb-6 lg:mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)] sm:text-sm">
          Carnet
        </p>
        <h1 className="mt-1 text-2xl font-semibold sm:mt-3 sm:text-3xl md:text-4xl">
          Tes notes, vivantes.
        </h1>
        <p className="mt-2 hidden text-[var(--color-fg-secondary)] sm:block">
          Markdown. Indexées automatiquement pour que le coach les retrouve
          quand tu poses une question.
        </p>
      </header>

      <NotebookClient />
    </main>
  );
}
