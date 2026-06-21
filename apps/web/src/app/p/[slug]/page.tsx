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
  const description = profile.tagline ?? "Apprentissage dev fullstack en cours.";

  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
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

  const startedDate = profile.startedAt ? new Date(profile.startedAt) : null;
  const daysSinceStart = startedDate
    ? Math.floor((Date.now() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <main className="min-h-svh px-4 py-10 sm:px-6 md:py-16 lg:px-12 xl:px-24">
      {/* Hero — panneau atelier */}
      <section className="mx-auto mb-8 max-w-3xl sm:mb-10">
        <header className="ph-panel ph-rivets relative overflow-hidden">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <div className="ph-station-header flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
              Porterfield Heroes · Vitrine publique
            </span>
            <span className="ph-ref">PROFILE-{profile.slug.toUpperCase()}</span>
          </div>
          <div className="px-5 py-6 sm:px-6 sm:py-8">
            <h1 className="text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl">
              {profile.displayName ?? profile.slug}
            </h1>
            {profile.tagline && (
              <p className="mt-3 text-base text-[var(--color-fg-secondary)] sm:text-lg">
                {profile.tagline}
              </p>
            )}
            {profile.bio && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-primary)] sm:text-base">
                {profile.bio}
              </p>
            )}
          </div>
        </header>
      </section>

      {/* Palier + XP */}
      <section className="mx-auto mb-6 max-w-3xl">
        <div className="ph-panel ph-rivets relative overflow-hidden">
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />
          <div className="ph-station-header flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
              Palier {profile.currentLevel?.id ?? 1}
            </span>
            <span className="ph-ref">XP</span>
          </div>
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl">
                  {profile.currentLevel?.icon ?? "🌱"}
                </span>
                <p className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
                  {profile.currentLevel?.name ?? "—"}
                </p>
              </div>
              <p className="font-mono tabular-nums">
                <span className="text-2xl font-bold sm:text-3xl">
                  {profile.currentXp ?? 0}
                </span>
                <span className="ml-1 text-sm text-[var(--color-fg-muted)]">
                  XP
                </span>
              </p>
            </div>
            {profile.progressPct !== undefined && (
              <div
                className="mt-4 h-2 overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-bg-base)]"
                style={{ borderRadius: 2 }}
              >
                <div
                  className="ph-stripes h-full bg-[var(--color-accent)]"
                  style={{ width: `${profile.progressPct}%` }}
                />
              </div>
            )}
            {profile.nextLevel && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                → {profile.nextLevel.name}
              </p>
            )}

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border-subtle)] pt-4">
              {profile.streakDays !== null && (
                <Stat label="Série" value={`${profile.streakDays}j`} />
              )}
              <Stat
                label="Modules"
                value={`${profile.completedModules.length}/5`}
              />
              <Stat label="Depuis" value={`${daysSinceStart}j`} />
            </div>
          </div>
        </div>
      </section>

      {/* Radar */}
      {profile.radar && profile.radar.length > 0 && (
        <section className="mx-auto mb-6 max-w-3xl">
          <div className="ph-panel ph-rivets relative overflow-hidden">
            <span className="ph-rivet-tl" />
            <span className="ph-rivet-tr" />
            <div className="ph-station-header flex items-center justify-between px-4 py-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
                Radar mastery · 12 axes pondérés
              </span>
              <span className="ph-ref">RADAR</span>
            </div>
            <div className="flex justify-center px-4 py-6 sm:px-6 sm:py-8">
              <RadarChart12 axes={profile.radar} size={380} />
            </div>
          </div>
        </section>
      )}

      {/* Stack complétée */}
      {profile.completedModules.length > 0 && (
        <section className="mx-auto mb-6 max-w-3xl">
          <div className="ph-panel ph-rivets relative overflow-hidden">
            <span className="ph-rivet-tl" />
            <span className="ph-rivet-tr" />
            <div className="ph-station-header flex items-center justify-between px-4 py-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
                Stations validées ({profile.completedModules.length})
              </span>
              <span className="ph-ref">STACK</span>
            </div>
            <ol className="divide-y divide-[var(--color-border-subtle)]">
              {profile.completedModules.map((m) => (
                <li
                  key={m.id}
                  className="flex items-baseline justify-between px-5 py-3"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="ph-ref tabular-nums">
                      M{String(m.moduleNumber).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      {m.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    {m.completedAt && (
                      <span className="ph-ref tabular-nums">
                        {new Date(m.completedAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    <span className="ph-stamp ph-stamp-done">✓</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Pitch */}
      {profile.pitchMarkdown && (
        <section className="mx-auto mb-6 max-w-3xl">
          <div className="ph-panel ph-rivets relative overflow-hidden">
            <span className="ph-rivet-tl" />
            <span className="ph-rivet-tr" />
            <div className="ph-station-header flex items-center justify-between px-4 py-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
                À propos de l&apos;atelier
              </span>
              <span className="ph-ref">ABOUT</span>
            </div>
            <div className="prose-coach max-w-none px-5 py-5 text-sm sm:px-6 sm:py-6">
              <Markdown source={profile.pitchMarkdown} />
            </div>
          </div>
        </section>
      )}

      <footer className="mx-auto mt-12 max-w-3xl border-t border-[var(--color-border-subtle)] pt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        Porterfield Heroes — atelier personnel
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-bold tabular-nums sm:text-lg">{value}</p>
    </div>
  );
}
