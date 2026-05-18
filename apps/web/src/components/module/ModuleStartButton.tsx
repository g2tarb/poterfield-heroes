"use client";

type Status = "locked" | "active" | "completed";

export function ModuleStartButton({
  moduleId: _moduleId,
  initialStatus,
}: {
  moduleId: string;
  initialStatus: Status;
}) {
  if (initialStatus === "completed") {
    return (
      <div className="ph-panel ph-rivets relative overflow-hidden border-l-4 border-l-[var(--color-success)] px-5 py-4">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-success)]">
          ✓ Module validé
        </p>
        <p className="mt-2 text-xs text-[var(--color-fg-secondary)]">
          Tu peux le revoir librement ou passer au suivant.
        </p>
      </div>
    );
  }

  if (initialStatus === "locked") {
    return (
      <div className="ph-panel ph-rivets relative overflow-hidden px-5 py-4 opacity-70">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-fg-muted)]">
          🔒 Verrouillé
        </p>
        <p className="mt-2 text-xs text-[var(--color-fg-secondary)]">
          Termine le module précédent pour déverrouiller celui-ci.
        </p>
      </div>
    );
  }

  // active = panneau "En cours" + CTA scroll vers exos
  return (
    <div className="ph-panel ph-rivets ph-pulse-glow relative overflow-hidden border-l-4 border-l-[var(--color-accent)]">
      <span className="ph-rivet-tl" />
      <span className="ph-rivet-tr" />
      <div className="ph-stripes pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative px-5 py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          ⚡ En cours
        </p>
        <p className="mt-2 text-xs text-[var(--color-fg-secondary)]">
          Lance-toi sur les étapes ci-dessous. Le coach est dispo à tout moment.
        </p>
        <a
          href="#exercises"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)]"
        >
          ▼ Premier exercice
        </a>
      </div>
    </div>
  );
}
