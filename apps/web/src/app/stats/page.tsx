import { StatsClient } from "@/components/dashboard/StatsClient";
import Link from "next/link";

export const metadata = { title: "Stats" };

export default function StatsPage() {
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
            Stats
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Radar mastery 12 axes
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Pondéré par contribution skill × pourcentage de mastery.
          </p>
        </header>

        <StatsClient />
    </main>
  );
}
