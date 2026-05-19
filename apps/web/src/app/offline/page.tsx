export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-svh place-items-center bg-[var(--color-bg-base)] px-6 py-12">
      <div className="w-full max-w-md text-center">
        <p
          className="ph-loader-title font-mono text-3xl font-bold uppercase tracking-tight sm:text-4xl"
          data-text="offline"
        >
          offline
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          // pas de réseau
        </p>
        <p className="mt-6 text-sm text-[var(--color-fg-secondary)]">
          Cette page n'a pas été mise en cache. Reconnecte-toi puis rafraîchis.
          Les modules déjà visités restent accessibles depuis le service worker.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/"
            className="inline-flex min-h-[40px] items-center border-2 border-[var(--color-accent)] px-4 text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/10 active:bg-[var(--color-accent)]/20"
          >
            ↻ retenter
          </a>
        </div>
      </div>
    </main>
  );
}
