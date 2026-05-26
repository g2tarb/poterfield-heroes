"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/**
 * YouTube IFrame Player API wrapper.
 * Charge le script https://www.youtube.com/iframe_api une seule fois,
 * crée le player et expose getCurrentTime / seekTo / pauseVideo / playVideo
 * via useImperativeHandle pour que VideoNotesPanel puisse ancrer une note
 * sur le timestamp exact.
 */

export type YoutubePlayerHandle = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  pauseVideo: () => void;
  playVideo: () => void;
};

type Props = {
  videoId: string;
  title?: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
};

// YT enum values (constants — pas besoin de typer ici)
export const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

// Singleton loader pour le script IFrame API
let iframeApiPromise: Promise<void> | null = null;

function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise<void>((resolve) => {
    const w = window as unknown as {
      YT?: { Player: unknown };
      onYouTubeIframeAPIReady?: () => void;
    };
    if (w.YT?.Player) {
      resolve();
      return;
    }

    // Hook global appelé par le script YT quand il est prêt
    w.onYouTubeIframeAPIReady = () => resolve();

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });

  return iframeApiPromise;
}

type YTPlayerInstance = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  destroy: () => void;
};

type YTPlayerConstructor = new (
  elementId: string,
  config: {
    videoId: string;
    playerVars?: Record<string, unknown>;
    events?: {
      onReady?: () => void;
      onStateChange?: (event: { data: number }) => void;
    };
  },
) => YTPlayerInstance;

export const YoutubePlayer = forwardRef<YoutubePlayerHandle, Props>(
  function YoutubePlayer({ videoId, title, onReady, onStateChange }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<YTPlayerInstance | null>(null);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
      seekTo: (s, allowAhead = true) =>
        playerRef.current?.seekTo(s, allowAhead),
      pauseVideo: () => playerRef.current?.pauseVideo(),
      playVideo: () => playerRef.current?.playVideo(),
    }));

    useEffect(() => {
      let cancelled = false;
      const elementId = `yt-player-${videoId}-${Math.random().toString(36).slice(2, 8)}`;
      if (containerRef.current) containerRef.current.id = elementId;

      loadYoutubeIframeApi()
        .then(() => {
          if (cancelled) return;
          const w = window as unknown as {
            YT: { Player: YTPlayerConstructor };
          };
          playerRef.current = new w.YT.Player(elementId, {
            videoId,
            playerVars: {
              rel: 0,
              modestbranding: 1,
              // playsinline pour iOS, sinon ça fullscreen agressif
              playsinline: 1,
            },
            events: {
              onReady: () => onReady?.(),
              onStateChange: (e) => onStateChange?.(e.data),
            },
          });
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "YT API load failed");
        });

      return () => {
        cancelled = true;
        try {
          playerRef.current?.destroy();
        } catch {
          /* déjà détruit */
        }
        playerRef.current = null;
      };
      // videoId change = recréer le player
    }, [videoId, onReady, onStateChange]);

    if (error) {
      return (
        <div className="ph-panel grid aspect-video w-full place-items-center bg-black p-4 text-center">
          <p className="font-mono text-xs text-[var(--color-danger)]">
            ⚠ YouTube API : {error}
          </p>
        </div>
      );
    }

    return (
      <div
        className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-black shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        aria-label={title ?? "YouTube video"}
      >
        <div ref={containerRef} className="h-full w-full" />
      </div>
    );
  },
);
