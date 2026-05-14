import { GithubPushList } from "@/components/github/GithubPushList";
import { CoachPanel } from "@/components/coach/CoachPanel";
import Link from "next/link";

export const metadata = { title: "GitHub" };

export default function GithubPage() {
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

        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
            GitHub
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Reviews automatiques
          </h1>
          <p className="mt-3 text-[var(--color-fg-secondary)]">
            Quand tu push sur un repo tracké, Claude review le diff. Annotations
            inline + score sur 7 critères. Configure le webhook GitHub →{" "}
            <code>https://api.yourdomain/api/github/webhook</code> avec ton{" "}
            <code>GITHUB_WEBHOOK_SECRET</code>.
          </p>
        </header>

        <GithubPushList />
      </main>
      <CoachPanel />
    </>
  );
}
