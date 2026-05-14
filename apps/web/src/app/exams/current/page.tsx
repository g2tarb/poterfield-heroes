import { ExamRunner } from "@/components/exams/ExamRunner";
import Link from "next/link";

export const metadata = { title: "Contrôle de la semaine" };

export default function ExamPage() {
  return (
    <main className="min-h-svh bg-[var(--color-bg-base)] px-6 py-12 md:px-12 lg:px-24">
      <nav className="mb-6 font-mono text-xs">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Quitter (= abandonner le contrôle)
        </Link>
      </nav>

      <header className="mb-8 max-w-2xl">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-danger)]">
          Examen en cours
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Contrôle vendredi
        </h1>
        <p className="mt-3 text-[var(--color-fg-secondary)]">
          10 QCM + 1 exo code. 60 min. Pas de coach pendant l&apos;examen, pas de
          révélation des réponses avant la soumission finale. Soumettre quand
          tu es prêt.
        </p>
      </header>

      <ExamRunner />
    </main>
  );
}
