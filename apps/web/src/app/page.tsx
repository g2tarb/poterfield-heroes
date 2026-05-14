import { Dashboard } from "@/components/dashboard/Dashboard";
import { CoachPanel } from "@/components/coach/CoachPanel";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main className="min-h-svh px-6 py-12 md:px-12 lg:px-24">
        <header className="mb-12 flex items-baseline justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
              Porterfield Heroes
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Atelier
            </h1>
          </div>
          <nav className="flex items-baseline gap-5 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
            <Link href="/srs" className="hover:text-[var(--color-fg-primary)]">
              SRS
            </Link>
            <Link
              href="/notebook"
              className="hover:text-[var(--color-fg-primary)]"
            >
              Carnet
            </Link>
            <Link
              href="/sandbox"
              className="hover:text-[var(--color-fg-primary)]"
            >
              Sandbox
            </Link>
          </nav>
        </header>

        <Dashboard />
      </main>
      <CoachPanel />
    </>
  );
}
