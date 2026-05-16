import { Sandbox } from "@/components/sandbox/Sandbox";
import Link from "next/link";

export const metadata = { title: "Sandbox" };

export default function SandboxPage() {
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

        <header className="mb-8 max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            Atelier libre
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Sandbox JavaScript
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Exécution isolée dans un Web Worker. Timeout 5s. Pas d&apos;accès DOM.
            Pour expérimenter, débugger un snippet, vérifier une intuition.
          </p>
        </header>

        <Sandbox title="Bac à sable JS" />
    </main>
  );
}
