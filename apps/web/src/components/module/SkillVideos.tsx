"use client";

import { useState } from "react";

export type SkillVideo = {
  youtubeId: string;
  title?: string;
  channel?: string;
  lang: "fr" | "en";
};

type Props = {
  videos: SkillVideo[];
  skillLabel: string;
};

export function SkillVideos({ videos, skillLabel }: Props) {
  const [open, setOpen] = useState(false);

  if (videos.length === 0) {
    const fallbackQuery = encodeURIComponent(skillLabel);
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${fallbackQuery}`}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] transition hover:text-[var(--color-accent)]"
      >
        <span aria-hidden>↗</span>
        <span>chercher sur youtube</span>
      </a>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] hover:text-[var(--color-fg-primary)]"
        aria-expanded={open}
      >
        <span aria-hidden>{open ? "▼" : "▶"}</span>
        <span>vidéos ({videos.length})</span>
      </button>

      {open && (
        <ul className="mt-3 space-y-2">
          {videos.map((v, i) => (
            <li key={`${v.youtubeId}-${i}`}>
              <VideoFacade video={v} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VideoFacade({ video }: { video: SkillVideo }) {
  const [playing, setPlaying] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const langBadge = video.lang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN";

  if (playing) {
    return (
      <div className="relative overflow-hidden border-2 border-[var(--color-accent)]">
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title ?? video.youtubeId}
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
      className="group relative block w-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-base)] text-left transition hover:border-[var(--color-accent)]"
      aria-label={`Lancer la vidéo ${video.title ?? video.youtubeId}`}
    >
      <div className="relative aspect-video w-full">
        {!imgFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-95"
            onError={() => setImgFailed(true)}
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center border-2 border-[var(--color-accent)] bg-black/70 text-xl text-[var(--color-accent)] transition group-hover:scale-110">
            ▶
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3 py-2 text-white">
          <div className="min-w-0">
            {video.title && (
              <p className="truncate text-xs font-semibold">{video.title}</p>
            )}
            {video.channel && (
              <p className="truncate font-mono text-[10px] uppercase tracking-widest opacity-75">
                {video.channel}
              </p>
            )}
          </div>
          <span className="shrink-0 border border-white/50 bg-black/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest">
            {langBadge}
          </span>
        </div>
      </div>
    </button>
  );
}
