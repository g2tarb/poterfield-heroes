import { Dashboard } from "@/components/dashboard/Dashboard";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-svh px-4 pb-8 pt-4 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      {/* Header desktop (caché sur mobile, où TopBar prend le relais) */}
      <header className="mb-8 hidden items-baseline justify-between lg:flex">
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            Porterfield Heroes
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Atelier</h1>
        </div>
        <nav className="flex items-baseline gap-5 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
          <Link href="/notebook" className="hover:text-[var(--color-fg-primary)]">
            Carnet
          </Link>
          <Link href="/stats" className="hover:text-[var(--color-fg-primary)]">
            Stats
          </Link>
          <Link href="/settings" className="hover:text-[var(--color-fg-primary)]">
            Réglages
          </Link>
        </nav>
      </header>

      <Dashboard />
    </main>
  );
}
