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
  /** Si > 5s, le player seek à cette position à onReady. Utilisé pour "reprendre où je m'étais arrêté". */
  initialSeekSeconds?: number;
  /** Fired toutes les ~5s pendant la lecture avec le temps courant. */
  onTimeUpdate?: (seconds: number, duration: number) => void;
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
  getDuration: () => number;
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
  function YoutubePlayer(
    { videoId, title, initialSeekSeconds, onTimeUpdate, onReady, onStateChange },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<YTPlayerInstance | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs stables sur les callbacks pour ne pas recréer le player à chaque rerender
    const onReadyRef = useRef(onReady);
    const onStateChangeRef = useRef(onStateChange);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const initialSeekRef = useRef(initialSeekSeconds);
    onReadyRef.current = onReady;
    onStateChangeRef.current = onStateChange;
    onTimeUpdateRef.current = onTimeUpdate;
    initialSeekRef.current = initialSeekSeconds;

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
      seekTo: (s, allowAhead = true) =>
        playerRef.current?.seekTo(s, allowAhead),
      pauseVideo: () => playerRef.current?.pauseVideo(),
      playVideo: () => playerRef.current?.playVideo(),
    }));

    useEffect(() => {
      let cancelled = false;
      let timeUpdateInterval: number | null = null;
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
              onReady: () => {
                // Restore position : seek si on a un point de reprise > 5s
                const seekTo = initialSeekRef.current;
                if (seekTo && seekTo > 5 && playerRef.current) {
                  playerRef.current.seekTo(seekTo, true);
                }
                onReadyRef.current?.();
              },
              onStateChange: (e) => {
                onStateChangeRef.current?.(e.data);
                // PLAYING (1) → démarre le polling, PAUSED/ENDED → arrête
                if (e.data === YT_STATE.PLAYING) {
                  if (timeUpdateInterval === null) {
                    timeUpdateInterval = window.setInterval(() => {
                      const p = playerRef.current;
                      if (!p) return;
                      onTimeUpdateRef.current?.(
                        p.getCurrentTime(),
                        p.getDuration(),
                      );
                    }, 5000);
                  }
                } else if (timeUpdateInterval !== null) {
                  // Fire un dernier update avant d'arrêter (pour catch le pause précis)
                  const p = playerRef.current;
                  if (p) {
                    onTimeUpdateRef.current?.(
                      p.getCurrentTime(),
                      p.getDuration(),
                    );
                  }
                  window.clearInterval(timeUpdateInterval);
                  timeUpdateInterval = null;
                }
              },
            },
          });
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "YT API load failed");
        });

      return () => {
        cancelled = true;
        if (timeUpdateInterval !== null) {
          window.clearInterval(timeUpdateInterval);
        }
        // Save final position avant destroy
        const p = playerRef.current;
        if (p) {
          try {
            onTimeUpdateRef.current?.(p.getCurrentTime(), p.getDuration());
          } catch {
            /* ignore */
          }
        }
        try {
          playerRef.current?.destroy();
        } catch {
          /* déjà détruit */
        }
        playerRef.current = null;
      };
      // videoId change = recréer le player ; callbacks via refs ne déclenchent pas
    }, [videoId]);

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
