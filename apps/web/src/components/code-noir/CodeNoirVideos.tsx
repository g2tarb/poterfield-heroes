"use client";

import { useState } from "react";

type Props = {
  /** Titre de la technique (fallback de recherche) */
  title: string;
  /** Mots-clés override pour la recherche YouTube */
  search?: string;
  /** IDs YouTube validés — affichés en embed */
  videoIds?: string[];
};

export function CodeNoirVideos({ title, search, videoIds }: Props) {
  const query = (search ?? title).trim();
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const hasEmbeds = videoIds && videoIds.length > 0;

  return (
    <section>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
        ▶ TUTORIELS
      </p>
      {hasEmbeds ? (
        <ul className="space-y-3">
          {videoIds.map((id) => (
            <li key={id}>
              <NoirYoutube videoId={id} fallbackQuery={query} />
            </li>
          ))}
          <li>
            <a
              href={searchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[rgba(0,255,136,0.4)] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.7)] transition hover:bg-[rgba(0,255,136,0.05)] hover:text-[#00ff88]"
            >
              <span aria-hidden>↗</span>
              <span>plus de vidéos · "{query}"</span>
            </a>
          </li>
        </ul>
      ) : (
        <a
          href={searchUrl}
          target="_blank"
          rel="noreferrer"
          className="ph-noir-card flex items-center gap-3 rounded p-3 transition hover:bg-[rgba(0,255,136,0.05)] active:bg-[rgba(0,255,136,0.1)]"
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center border border-[#00ff88] text-base text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.4)]"
            aria-hidden
          >
            ▶
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
              YouTube · search
            </span>
            <span className="mt-0.5 block truncate font-mono text-xs text-[#00ff88] ph-noir-glow">
              {query}
            </span>
          </span>
          <span
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]"
            aria-hidden
          >
            ↗
          </span>
        </a>
      )}
    </section>
  );
}

/**
 * Embed YouTube façade : thumbnail noir/vert au repos, iframe au clic.
 * Évite de charger 30+ iframes par page.
 */
function NoirYoutube({
  videoId,
  fallbackQuery,
}: {
  videoId: string;
  fallbackQuery: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="relative overflow-hidden border-2 border-[#00ff88] shadow-[0_0_18px_rgba(0,255,136,0.3)]">
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`Code Noir — ${fallbackQuery}`}
            allow="accelerated-2d-canvas; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full overflow-hidden border-2 border-[rgba(0,255,136,0.5)] bg-black text-left transition hover:border-[#00ff88] hover:shadow-[0_0_18px_rgba(0,255,136,0.3)]"
      aria-label={`Lancer la vidéo YouTube ${videoId}`}
    >
      <div className="relative aspect-video w-full">
        {!imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen grayscale contrast-125 transition group-hover:opacity-80"
            onError={() => setImgFailed(true)}
            loading="lazy"
          />
        )}
        {/* tint vert pour rester dans le DA noir */}
        <div className="pointer-events-none absolute inset-0 bg-[rgba(0,255,136,0.08)] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center border-2 border-[#00ff88] bg-black/70 text-2xl text-[#00ff88] shadow-[0_0_24px_rgba(0,255,136,0.6)] transition group-hover:scale-110">
            ▶
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00ff88]">
          <span className="truncate">▸ {fallbackQuery}</span>
          <span className="opacity-60">YT · {videoId}</span>
        </div>
      </div>
    </button>
  );
}
