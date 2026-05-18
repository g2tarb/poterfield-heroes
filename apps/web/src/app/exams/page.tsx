import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

type ExamSummary = {
  id: string;
  weekStartDate: string;
  generatedAt: string;
};

async function getExams(): Promise<ExamSummary[]> {
  try {
    return await apiFetch<ExamSummary[]>("/api/exams?limit=50");
  } catch {
    return [];
  }
}

export const metadata = { title: "Examens" };

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Contrôles hebdomadaires"
        title="Examens"
        subtitle="Tous les contrôles que tu as passés. Un nouveau est généré chaque vendredi soir à partir de ton activité de la semaine."
        ref="EXAMS"
      />

      <div className="mx-auto max-w-3xl">
        <div className="ph-panel ph-rivets relative mb-4 overflow-hidden border-l-4 border-l-[var(--color-accent)]">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <div className="ph-stripes pointer-events-none absolute inset-0 opacity-25" aria-hidden />
          <div className="relative px-5 py-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
              Contrôle en cours
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
              Si un examen est disponible cette semaine, lance-le sans coach et
              sans révision préalable.
            </p>
            <Link
              href="/exams/current"
              className="mt-4 inline-flex items-center gap-2 border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)]"
            >
              ▶ Démarrer le contrôle
            </Link>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="ph-panel relative overflow-hidden px-5 py-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              Aucun examen encore
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
              Le premier contrôle se générera automatiquement le vendredi suivant
              ton 1er module démarré.
            </p>
          </div>
        ) : (
          <ol className="space-y-2">
            {exams.map((e) => (
              <li key={e.id}>
                <Link href={`/exams/${e.id}`} className="block">
                  <article className="ph-panel relative flex items-center gap-4 overflow-hidden px-4 py-3 transition lg:hover:translate-y-[-1px]">
                    <span className="ph-ref shrink-0">EXAM</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold uppercase tracking-wide">
                        Semaine du{" "}
                        {new Date(e.weekStartDate).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                        généré le{" "}
                        {new Date(e.generatedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="ph-ref shrink-0">→</span>
                  </article>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
