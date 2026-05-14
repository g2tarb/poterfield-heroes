"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        config: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YtPlayer }) => void;
            onStateChange?: (event: { data: number; target: YtPlayer }) => void;
          };
        },
      ) => YtPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

let apiLoadPromise: Promise<void> | null = null;

function loadYTApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiLoadPromise;
}

export type Checkpoint = {
  id: string;
  seconds: number;
  kind: "quiz" | "note" | "pause";
  payload?: unknown;
};

type Props = {
  videoId: string;
  startSeconds?: number;
  checkpoints?: Checkpoint[];
  onCheckpoint?: (checkpoint: Checkpoint, player: YtPlayer) => void;
  onProgress?: (currentSeconds: number, duration: number) => void;
  onComplete?: () => void;
};

export function YoutubePlayer({
  videoId,
  startSeconds = 0,
  checkpoints = [],
  onCheckpoint,
  onProgress,
  onComplete,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const triggeredRef = useRef<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await loadYTApi();
      if (cancelled || !hostRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          start: Math.floor(startSeconds),
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (event) => {
            // 0 = ENDED
            if (event.data === 0) {
              onComplete?.();
            }
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Polling loop : current time, checkpoint detection, progress persistence
  useEffect(() => {
    if (!ready) return;
    let lastReport = 0;
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      const current = player.getCurrentTime();
      const duration = player.getDuration();

      // Checkpoint detection (within 0.7s window, debounced via Set)
      for (const cp of checkpoints) {
        if (
          !triggeredRef.current.has(cp.id) &&
          current >= cp.seconds &&
          current <= cp.seconds + 0.7
        ) {
          triggeredRef.current.add(cp.id);
          player.pauseVideo();
          onCheckpoint?.(cp, player);
        }
      }

      // Progress reporting (every 10s)
      if (current - lastReport >= 10 || current < lastReport) {
        lastReport = current;
        onProgress?.(current, duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ready, checkpoints, onCheckpoint, onProgress]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-black">
      <div ref={hostRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-[var(--color-fg-muted)]">
          Chargement du player…
        </div>
      )}
    </div>
  );
}
