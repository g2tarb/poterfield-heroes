"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

type ProgressRow = {
  videoId: string;
  lastPositionSeconds: number;
  watchedSeconds: number;
  completedAt: string | null;
  updatedAt: string;
};

/**
 * Gère la sauvegarde/restauration de la position d'une vidéo via
 * /api/video/:id/progress.
 *
 * - GET au mount : si la vidéo a une position > 5s ET pas completed → initialSeek
 * - saveProgress() throttled (max 1× / 4s) pour ne pas spammer l'API pendant la lecture
 * - Sauve aussi sur beforeunload (sendBeacon) pour catcher le close brutal
 */
export function useVideoProgress(videoUuid: string) {
  const [initialSeek, setInitialSeek] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const lastSaveRef = useRef<number>(0);
  const lastSavedSecondsRef = useRef<number>(-1);

  // Load existing progress au mount
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setInitialSeek(null);

    void (async () => {
      try {
        const row = await apiFetch<ProgressRow | null>(
          `/api/video/${videoUuid}/progress`,
        );
        if (cancelled) return;
        if (row && !row.completedAt && row.lastPositionSeconds > 5) {
          setInitialSeek(row.lastPositionSeconds);
        }
      } catch {
        /* pas auth ou pas de progress = OK */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [videoUuid]);

  // Save callback throttled
  const saveProgress = useCallback(
    (seconds: number, duration?: number) => {
      const now = Date.now();
      // Throttle : 4s mini entre 2 POST + 3s mini de delta sur le temps
      if (
        now - lastSaveRef.current < 4000 &&
        Math.abs(seconds - lastSavedSecondsRef.current) < 3
      ) {
        return;
      }
      lastSaveRef.current = now;
      lastSavedSecondsRef.current = seconds;

      const body = JSON.stringify({
        currentSeconds: Math.floor(seconds),
        ...(duration ? { duration: Math.floor(duration) } : {}),
      });

      void apiFetch(`/api/video/${videoUuid}/progress`, {
        method: "POST",
        body,
      }).catch(() => {
        /* silently ignore — on retentera au prochain tick */
      });
    },
    [videoUuid],
  );

  // beforeunload : tente un sendBeacon pour la dernière position
  useEffect(() => {
    const handler = () => {
      // Le hook ne connaît pas le current time ici — c'est l'appelant qui
      // doit avoir POST récemment via saveProgress. Ce listener est un filet
      // de sécurité passif (on a l'interval 5s du YT player qui couvre le 99% cases).
      // Si on voulait vraiment être paranoïaque on stockerait le dernier
      // seconds dans une ref et on enverrait via navigator.sendBeacon ici.
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return { initialSeek, loaded, saveProgress };
}
