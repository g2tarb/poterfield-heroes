"use client";

import { useEffect, useState, useTransition } from "react";
import { apiFetch } from "@/lib/api";
import { useWebPush } from "@/hooks/useWebPush";
import { cn } from "@/lib/cn";

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

  function update(
    patch: Partial<NonNullable<Settings["user"]>["preferences"]>,
  ) {
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
    const confirmText = prompt(
      'Pour confirmer, tape "RESET" (en majuscules) :',
    );
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
      <div className="rounded-xl border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]"
          />
        ))}
      </div>
    );
  }

  const prefs = settings.user?.preferences ?? {};
  const budget = settings.aiBudget;
  const pct = Math.min(
    100,
    Math.round(
      (budget.spentThisMonthCents / Math.max(1, budget.monthlyLimitCents)) * 100,
    ),
  );
  const budgetColor =
    pct > 90
      ? "bg-[var(--color-danger)]"
      : pct > 70
        ? "bg-[var(--color-warning)]"
        : "bg-[var(--color-accent)]";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Préférences */}
      <Section title="Préférences">
        <ToggleRow
          label="Reduced motion"
          sub="Désactive les animations 3D et les transitions"
          checked={prefs.reducedMotion ?? false}
          onChange={(v) => update({ reducedMotion: v })}
        />
        <ToggleRow
          label="Voix TTS coach"
          sub="Lecture audio des réponses (nécessite ELEVENLABS_API_KEY)"
          checked={prefs.voiceTts ?? false}
          onChange={(v) => update({ voiceTts: v })}
        />
        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <p className="text-sm font-medium">Cartes SRS / jour</p>
            <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
              Cible quotidienne de nouvelles cartes
            </p>
          </div>
          <input
            type="number"
            min={5}
            max={200}
            value={prefs.dailySrsTarget ?? 20}
            onChange={(e) => update({ dailySrsTarget: Number(e.target.value) })}
            className="w-20 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-2 py-1.5 text-right font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
      </Section>

      {/* Push */}
      <Section title="Notifications push">
        <div className="flex items-center justify-between gap-3 py-2">
          <div>
            <p className="text-sm font-medium">État</p>
            <p className="mt-0.5 font-mono text-xs text-[var(--color-fg-muted)]">
              {push.status}
            </p>
          </div>
          <div className="flex gap-2">
            {push.status !== "subscribed" && (
              <button
                type="button"
                onClick={() => void push.subscribe()}
                disabled={push.status === "unsupported"}
                className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-fg)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                S&apos;abonner
              </button>
            )}
            {push.status === "subscribed" && (
              <>
                <button
                  type="button"
                  onClick={testPush}
                  className="rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition hover:border-[var(--color-accent)]"
                >
                  Tester
                </button>
                <button
                  type="button"
                  onClick={() => void push.unsubscribe()}
                  className="rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
                >
                  Désabo
                </button>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Budget IA */}
      <Section title="Budget IA · mois en cours">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl tabular-nums">
            {(budget.spentThisMonthCents / 100).toFixed(2)}
            <span className="ml-1 text-base text-[var(--color-fg-muted)]">€</span>
          </span>
          <span className="font-mono text-xs text-[var(--color-fg-muted)]">
            / {(budget.monthlyLimitCents / 100).toFixed(0)}€ ·{" "}
            <span
              className={cn(
                "font-semibold",
                pct > 90 && "text-[var(--color-danger)]",
                pct > 70 && pct <= 90 && "text-[var(--color-warning)]",
              )}
            >
              {pct}%
            </span>
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              budgetColor,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs">
          <Stat label="Input" value={budget.inputTokens.toLocaleString("fr-FR")} />
          <Stat
            label="Output"
            value={budget.outputTokens.toLocaleString("fr-FR")}
          />
          <Stat label="Sessions" value={budget.sessionsCount.toString()} />
        </div>
      </Section>

      {/* SRS stats */}
      <Section title="SRS — long terme">
        <p className="font-mono text-sm">
          <span className="tabular-nums text-[var(--color-success)]">
            {settings.srs.mature}
          </span>
          <span className="text-[var(--color-fg-muted)]"> mature / </span>
          <span className="tabular-nums">{settings.srs.total}</span>
          <span className="text-[var(--color-fg-muted)]"> total</span>
        </p>
        <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
          Mature = intervalle ≥ 21j. C&apos;est ton indicateur d&apos;ancrage
          long-terme — pas le nombre de cartes total.
        </p>
      </Section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-[var(--color-danger)]/40 bg-[var(--color-bg-elevated)] p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-danger)]">
          ⚠ Zone dangereuse
        </h2>
        <p className="text-sm text-[var(--color-fg-secondary)]">
          Reset complet : XP, streak, cartes SRS, attempts, notes carnet,
          historique coach, reviews GitHub, examens. Le contenu (modules,
          skills, vidéos) est conservé.
        </p>
        <button
          type="button"
          onClick={resetProgress}
          disabled={pending}
          className="mt-4 rounded-lg border border-[var(--color-danger)] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-white disabled:opacity-50"
        >
          Reset complet
        </button>
      </section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--color-bg-base)] p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-1 font-mono tabular-nums">{value}</p>
    </div>
  );
}

function ToggleRow({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {sub && (
          <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{sub}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked
            ? "bg-[var(--color-accent)]"
            : "bg-[var(--color-bg-high)] border border-[var(--color-border-subtle)]",
        )}
      >
        <span
          className={cn(
            "inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </label>
  );
}
