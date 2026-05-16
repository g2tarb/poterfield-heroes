import { SrsReviewer } from "@/components/srs/SrsReviewer";
import Link from "next/link";

export const metadata = { title: "Révisions SRS" };

export default function SrsPage() {
  return (
    <main className="min-h-svh px-4 pb-8 pt-4 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <nav className="mb-8 font-mono text-xs">
        <Link
          href="/"
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          ← Accueil
        </Link>
      </nav>

      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
          Spaced Repetition
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Révisions du jour
        </h1>
        <p className="mt-3 text-[var(--color-fg-secondary)]">
          Algorithme FSRS-4. Réponds honnêtement — c&apos;est l&apos;auto-tromperie
          qui te coûte la rétention, pas l&apos;échec.
        </p>
      </header>

      <SrsReviewer />
    </main>
  );
}
