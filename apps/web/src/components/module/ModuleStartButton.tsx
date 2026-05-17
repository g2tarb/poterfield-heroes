"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Status = "locked" | "active" | "completed";

export function ModuleStartButton({
  moduleId,
  initialStatus,
}: {
  moduleId: string;
  initialStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStart() {
    setError(null);
    startTransition(async () => {
      try {
        await apiFetch(`/api/progress/module/${moduleId}/start`, {
          method: "POST",
        });
        setStatus("active");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      }
    });
  }

  if (status === "completed") {
    return (
      <div className="rounded-xl border-2 border-[var(--color-success)] bg-[var(--color-bg-elevated)] p-4 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-success)]">
          ✓ Module validé
        </p>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] p-4 text-center ph-pulse-glow">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          ▶ En cours
        </p>
        <p className="mt-1 text-xs text-[var(--color-fg-secondary)]">
          Travaille dessus, le coach est dispo en bas à droite.
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleStart}
        disabled={pending}
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-fg)] transition active:scale-[0.98] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Démarrage…" : "▶ Démarrer ce module"}
      </button>
      {error && (
        <p className="mt-2 font-mono text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </>
  );
}
