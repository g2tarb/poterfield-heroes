import { ExamRunner } from "@/components/exams/ExamRunner";
import Link from "next/link";

export const metadata = { title: "Contrôle de la semaine" };

export default function ExamPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <nav className="mb-3 font-mono text-xs sm:mb-6">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Quitter (= abandonner le contrôle)
        </Link>
      </nav>

      <header className="ph-panel ph-rivets relative mb-6 overflow-hidden border-l-4 border-l-[var(--color-danger)] sm:mb-8">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <div className="ph-stripes-warn pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="ph-station-header relative flex items-center justify-between px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-danger)]">
            ╳ Examen en cours
          </span>
          <span className="ph-ref">EXAM-LIVE</span>
        </div>
        <div className="relative px-4 py-4 sm:px-5 sm:py-5">
          <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl md:text-4xl">
            Contrôle vendredi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-secondary)] sm:mt-3">
            10 QCM + 1 exo code. 60 min. Pas de coach pendant l&apos;examen, pas de
            révélation des réponses avant la soumission finale. Soumettre quand
            tu es prêt.
          </p>
        </div>
      </header>

      <ExamRunner />
    </main>
  );
}
