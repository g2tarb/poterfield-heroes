"use client";

import { useEffect, useState, useTransition } from "react";
import { apiFetch } from "@/lib/api";
import { useWebPush } from "@/hooks/useWebPush";

type Settings = {
  user: {
    displayName: string;
    email: string | null;
    avatarUrl: string | null;
    preferences: {
      voiceTts?: boolean;
      reducedMotion?: boolean;
      dailySrsTarget?: number;
      accentColor?: string;
    } | null;
  } | null;
  aiBudget: {
    monthlyLimitCents: number;
    spentThisMonthCents: number;
    inputTokens: number;
    outputTokens: number;
    sessionsCount: number;
  };
  srs: { total: number; mature: number };
};

export function SettingsClient() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const push = useWebPush();

  useEffect(() => {
    void (async () => {
      try {
        const s = await apiFetch<Settings>("/api/settings");
        setSettings(s);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);

  function update(patch: Partial<NonNullable<Settings["user"]>["preferences"]>) {
    if (!settings?.user) return;
    const next = { ...settings.user.preferences, ...patch };
    setSettings({ ...settings, user: { ...settings.user, preferences: next } });

    startTransition(async () => {
      try {
        await apiFetch("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({ preferences: patch }),
        });
      } catch (e) {
        setError((e as Error).message);
      }
    });
  }

  async function testPush() {
    try {
      await apiFetch("/api/push/test", { method: "POST", body: "{}" });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function resetProgress() {
    const confirmText = prompt('Pour confirmer, tape "RESET" (en majuscules) :');
    if (confirmText !== "RESET") return;
    try {
      await apiFetch("/api/settings/reset-progress", {
        method: "POST",
        body: JSON.stringify({ confirm: "RESET" }),
      });
      alert("Progression remise à zéro. Tu repars de M1.");
      window.location.href = "/";
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-danger)]">
        {error}
      </div>
    );
  }
  if (!settings) {
    return <p className="text-[var(--color-fg-muted)]">Chargement…</p>;
  }

  const prefs = settings.user?.preferences ?? {};
  const budget = settings.aiBudget;
  const pct = Math.min(
    100,
    Math.round((budget.spentThisMonthCents / Math.max(1, budget.monthlyLimitCents)) * 100),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Préférences */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Préférences
        </h2>
        <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
          <Toggle
            label="Reduced motion (animations désactivées)"
            checked={prefs.reducedMotion ?? false}
            onChange={(v) => update({ reducedMotion: v })}
          />
          <Toggle
            label="Coach voice TTS (lecture audio des réponses)"
            checked={prefs.voiceTts ?? false}
            onChange={(v) => update({ voiceTts: v })}
            sub="Nécessite ELEVENLABS_API_KEY"
          />
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="dailySrsTarget" className="text-sm">
              Cartes SRS quotidien cible
            </label>
            <input
              id="dailySrsTarget"
              type="number"
              min={5}
              max={200}
              value={prefs.dailySrsTarget ?? 20}
              onChange={(e) =>
                update({ dailySrsTarget: Number(e.target.value) })
              }
              className="w-24 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-2 py-1 text-right font-mono text-sm"
            />
          </div>
        </div>
      </section>

      {/* Push notifications */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Notifications push
        </h2>
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
          <p className="text-sm">
            État :{" "}
            <span className="font-mono text-[var(--color-fg-primary)]">
              {push.status}
            </span>
          </p>
          <div className="mt-3 flex gap-2">
            {push.status !== "subscribed" && (
              <button
                type="button"
                onClick={() => void push.subscribe()}
                disabled={push.status === "unsupported"}
                className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-accent-fg)] disabled:opacity-40"
              >
                S&apos;abonner
              </button>
            )}
            {push.status === "subscribed" && (
              <>
                <button
                  type="button"
                  onClick={testPush}
                  className="rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-[var(--color-accent)]"
                >
                  Tester
                </button>
                <button
                  type="button"
                  onClick={() => void push.unsubscribe()}
                  className="rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-[var(--color-danger)]"
                >
                  Désabonner
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Budget IA */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Budget IA — mois en cours
        </h2>
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl tabular-nums">
              {(budget.spentThisMonthCents / 100).toFixed(2)}
              <span className="ml-1 text-base text-[var(--color-fg-muted)]">€</span>
            </span>
            <span className="font-mono text-xs text-[var(--color-fg-muted)]">
              / {(budget.monthlyLimitCents / 100).toFixed(0)}€ cap
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
            <div
              className="h-full bg-[var(--color-accent)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <p className="text-[var(--color-fg-muted)] uppercase">Input tokens</p>
              <p className="mt-1 tabular-nums">{budget.inputTokens.toLocaleString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-[var(--color-fg-muted)] uppercase">Output tokens</p>
              <p className="mt-1 tabular-nums">{budget.outputTokens.toLocaleString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-[var(--color-fg-muted)] uppercase">Sessions</p>
              <p className="mt-1 tabular-nums">{budget.sessionsCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SRS stats */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          SRS
        </h2>
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
          <p className="text-sm">
            <span className="font-mono tabular-nums">{settings.srs.mature}</span> /{" "}
            <span className="font-mono tabular-nums">{settings.srs.total}</span> cartes mature
          </p>
          <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
            Mature = interval ≥ 21 jours. Indicateur clé d&apos;ancrage long-terme.
          </p>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-danger)]">
          Zone dangereuse
        </h2>
        <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-5">
          <p className="text-sm">
            Reset complet de la progression (XP, streak, cartes SRS, attempts, notes
            carnet, coach history, github reviews, examens). Le contenu (modules,
            skills, vidéos) est conservé.
          </p>
          <button
            type="button"
            onClick={resetProgress}
            disabled={pending}
            className="mt-4 rounded-md border border-[var(--color-danger)] bg-transparent px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white disabled:opacity-50"
          >
            Reset progression
          </button>
        </div>
      </section>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  sub,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  sub?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3">
      <span>
        <span className="block text-sm">{label}</span>
        {sub && (
          <span className="block text-xs text-[var(--color-fg-muted)]">{sub}</span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-5 accent-[var(--color-accent)]"
      />
    </label>
  );
}
