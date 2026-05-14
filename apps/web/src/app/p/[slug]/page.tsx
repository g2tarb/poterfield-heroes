import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiFetch, ApiError } from "@/lib/api";
import { RadarChart12 } from "@/components/dashboard/RadarChart12";
import { Markdown } from "@/components/coach/Markdown";

type PublicProfile = {
  slug: string;
  bio: string | null;
  tagline: string | null;
  pitchMarkdown: string | null;
  customAccentHex: string | null;
  displayName?: string;
  avatarUrl?: string | null;
  currentLevel: {
    id: number;
    slug: string;
    name: string;
    icon: string | null;
    description: string;
  } | null;
  nextLevel: { name: string; xpRequired: number } | null;
  currentXp?: number;
  streakDays: number | null;
  startedAt?: string;
  progressPct?: number;
  radar:
    | Array<{ id: string; label: string; colorHex: string; score: number }>
    | null;
  completedModules: Array<{
    id: string;
    moduleNumber: number;
    phase: number;
    title: string;
    completedAt: string | null;
  }>;
};

async function getProfile(slug: string): Promise<PublicProfile | null> {
  try {
    return await apiFetch<PublicProfile>(`/api/public/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug).catch(() => null);
  if (!profile) return { title: "Profil introuvable" };

  const title = `${profile.displayName ?? slug} · Porterfield Heroes`;
  const description =
    profile.tagline ?? "Apprentissage dev fullstack en cours.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  const startedDate = profile.startedAt
    ? new Date(profile.startedAt)
    : null;
  const daysSinceStart = startedDate
    ? Math.floor((Date.now() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <main className="min-h-svh px-6 py-16 md:px-12 lg:px-24">
      {/* Hero */}
      <section className="mx-auto mb-16 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Porterfield Heroes / {profile.slug}
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
          {profile.displayName ?? profile.slug}
        </h1>
        {profile.tagline && (
          <p className="mt-3 text-xl text-[var(--color-fg-secondary)]">
            {profile.tagline}
          </p>
        )}
        {profile.bio && (
          <p className="mt-6 max-w-2xl text-[var(--color-fg-primary)]">
            {profile.bio}
          </p>
        )}
      </section>

      {/* Palier + XP */}
      <section className="mx-auto mb-12 max-w-3xl rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              Palier actuel
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {profile.currentLevel?.icon} {profile.currentLevel?.name ?? "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl tabular-nums">
              {profile.currentXp ?? 0}
              <span className="ml-1 text-base text-[var(--color-fg-muted)]">
                XP
              </span>
            </p>
            {profile.nextLevel && (
              <p className="mt-1 font-mono text-xs text-[var(--color-fg-muted)]">
                → {profile.nextLevel.name}
              </p>
            )}
          </div>
        </div>
        {profile.progressPct !== undefined && (
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-bg-high)]">
            <div
              className="h-full bg-[var(--color-accent)]"
              style={{ width: `${profile.progressPct}%` }}
            />
          </div>
        )}
        <div className="mt-6 grid grid-cols-3 gap-4 font-mono text-xs">
          {profile.streakDays !== null && (
            <Stat label="Série" value={`${profile.streakDays}j`} />
          )}
          <Stat label="Modules" value={`${profile.completedModules.length}/25`} />
          <Stat label="Depuis" value={`${daysSinceStart}j`} />
        </div>
      </section>

      {/* Radar */}
      {profile.radar && profile.radar.length > 0 && (
        <section className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-6 text-xl font-semibold">
            Mastery — 12 axes pondérés
          </h2>
          <div className="flex justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-10">
            <RadarChart12 axes={profile.radar} size={400} />
          </div>
        </section>
      )}

      {/* Stack complétée */}
      {profile.completedModules.length > 0 && (
        <section className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-6 text-xl font-semibold">Modules validés</h2>
          <ol className="space-y-2">
            {profile.completedModules.map((m) => (
              <li
                key={m.id}
                className="flex items-baseline justify-between rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-4 py-3"
              >
                <span>
                  <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                    M{String(m.moduleNumber).padStart(2, "0")}
                  </span>{" "}
                  <span className="ml-2">{m.title}</span>
                </span>
                {m.completedAt && (
                  <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                    {new Date(m.completedAt).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Pitch */}
      {profile.pitchMarkdown && (
        <section className="mx-auto max-w-3xl rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            À propos de l&apos;outil
          </h2>
          <div className="prose-coach max-w-none">
            <Markdown source={profile.pitchMarkdown} />
          </div>
        </section>
      )}

      <footer className="mx-auto mt-20 max-w-3xl border-t border-[var(--color-border-subtle)] pt-6 font-mono text-xs text-[var(--color-fg-muted)]">
        Porterfield Heroes — outil personnel.
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg tabular-nums">{value}</p>
    </div>
  );
}
