import { SettingsClient } from "@/components/settings/SettingsClient";
import { CoachPanel } from "@/components/coach/CoachPanel";
import Link from "next/link";

export const metadata = { title: "Réglages" };

export default function SettingsPage() {
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

        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            Réglages
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Atelier
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Préférences, budget IA, actions destructives.
          </p>
        </header>

        <SettingsClient />
      </main>
      <CoachPanel />
    </>
  );
}
