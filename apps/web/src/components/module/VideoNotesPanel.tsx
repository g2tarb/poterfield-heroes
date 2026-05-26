"use client";

import { useEffect, useState, type RefObject } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { YoutubePlayerHandle } from "./YoutubePlayer";
import { burstXp } from "@/lib/feedback";

type Note = {
  id: string;
  moduleId: string | null;
  source: "user" | "coach" | "system";
  title: string;
  contentMarkdown: string;
  tags: string[];
  starred: number;
  videoYoutubeId: string | null;
  videoTimestampSeconds: number | null;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  moduleId: string;
  videoYoutubeId: string;
  videoTitle: string;
  playerRef: RefObject<YoutubePlayerHandle | null>;
};

function formatTime(seconds: number): string {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function VideoNotesPanel({
  moduleId,
  videoYoutubeId,
  videoTitle,
  playerRef,
}: Props) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<{
    title: string;
    content: string;
    timestamp: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes au mount + chaque fois que videoYoutubeId change
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const rows = await apiFetch<Note[]>(
          `/api/notebook?moduleId=${encodeURIComponent(moduleId)}&videoYoutubeId=${encodeURIComponent(videoYoutubeId)}&limit=200`,
        );
        if (!cancelled) {
          // Tri chronologique sur le timestamp vidéo (notes au début de la vidéo en premier)
          rows.sort(
            (a, b) =>
              (a.videoTimestampSeconds ?? 0) - (b.videoTimestampSeconds ?? 0),
          );
          setNotes(rows);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("[VideoNotes] fetch failed", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [moduleId, videoYoutubeId]);

  function startNewNote() {
    const ts = Math.floor(playerRef.current?.getCurrentTime() ?? 0);
    // Pause la vidéo automatiquement pour qu'Erwin puisse écrire tranquille
    playerRef.current?.pauseVideo();
    setDraft({
      title: `Note à ${formatTime(ts)}`,
      content: "",
      timestamp: ts,
    });
    setOpen(true);
    setError(null);
  }

  async function saveNote() {
    if (!draft) return;
    if (draft.content.trim().length === 0) {
      setError("Le contenu ne peut pas être vide.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const inserted = await apiFetch<Note>("/api/notebook", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          source: "user",
          title: draft.title.trim() || `Note à ${formatTime(draft.timestamp)}`,
          contentMarkdown: draft.content,
          videoYoutubeId,
          videoTimestampSeconds: draft.timestamp,
          tags: [`video:${videoYoutubeId}`, `module:${moduleId}`],
        }),
      });
      setNotes((prev) =>
        [...prev, inserted].sort(
          (a, b) =>
            (a.videoTimestampSeconds ?? 0) - (b.videoTimestampSeconds ?? 0),
        ),
      );
      setDraft(null);
      burstXp(5, "note");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
  }

  function seekToNote(seconds: number) {
    playerRef.current?.seekTo(seconds, true);
    playerRef.current?.playVideo();
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+64px)] z-30 lg:bottom-2">
      <div className="mx-auto max-w-3xl px-3 sm:px-6">
        <div
          className={`ph-panel ph-rivets relative overflow-hidden border-l-4 border-l-[var(--color-accent)] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] transition-[max-height] duration-300 ${open ? "max-h-[80vh]" : "max-h-14"}`}
        >
          <span className="ph-rivet-tl" />
          <span className="ph-rivet-tr" />

          {/* Header : toggle open/closed + CTA new note */}
          <header
            className="ph-station-header flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span aria-hidden className="text-base">
                {open ? "▼" : "▲"}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                📝 Notes vidéo
              </span>
              <span className="ph-ref shrink-0 tabular-nums">
                {notes.length}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startNewNote();
              }}
              className="shrink-0 border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)]"
            >
              + Note à{" "}
              <span className="tabular-nums">
                {formatTime(playerRef.current?.getCurrentTime() ?? 0)}
              </span>
            </button>
          </header>

          {/* Contenu (visible uniquement quand open) */}
          {open && (
            <div className="max-h-[calc(80vh-50px)] overflow-y-auto px-4 py-3">
              {/* Form de saisie */}
              {draft && (
                <section className="mb-4 rounded border-2 border-[var(--color-accent)] bg-[var(--color-bg-base)] p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                      📍 Note à{" "}
                      <span className="tabular-nums">
                        {formatTime(draft.timestamp)}
                      </span>
                    </p>
                    <span className="ph-ref truncate max-w-[60%]">
                      {videoTitle}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                    placeholder="Titre de la note (optionnel)"
                    className="mt-2 block w-full rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-2 py-1.5 font-mono text-xs focus:border-[var(--color-accent)] focus:outline-none"
                  />
                  <textarea
                    value={draft.content}
                    onChange={(e) =>
                      setDraft({ ...draft, content: e.target.value })
                    }
                    rows={5}
                    spellCheck={false}
                    autoFocus
                    placeholder="Ta note ici…  Markdown supporté."
                    className="mt-2 block w-full resize-y rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-2 font-mono text-sm leading-relaxed focus:border-[var(--color-accent)] focus:outline-none"
                  />
                  {error && (
                    <p className="mt-2 text-xs text-[var(--color-danger)]">
                      {error}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      disabled={saving}
                      className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                    >
                      annuler
                    </button>
                    <button
                      type="button"
                      onClick={saveNote}
                      disabled={saving || draft.content.trim().length === 0}
                      className="border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition hover:bg-[var(--color-bg-high)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "save…" : "▶ enregistrer"}
                    </button>
                  </div>
                </section>
              )}

              {/* Liste notes */}
              {loading ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  Chargement…
                </p>
              ) : notes.length === 0 ? (
                <p className="text-sm text-[var(--color-fg-secondary)]">
                  Aucune note sur cette vidéo. Clique{" "}
                  <span className="font-mono text-[var(--color-accent)]">
                    + Note
                  </span>{" "}
                  pour ancrer ta première au timestamp courant.
                </p>
              ) : (
                <ul className="space-y-2">
                  {notes.map((note) => (
                    <li key={note.id}>
                      <NoteCard note={note} onSeek={seekToNote} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoteCard({
  note,
  onSeek,
}: {
  note: Note;
  onSeek: (seconds: number) => void;
}) {
  const ts = note.videoTimestampSeconds;
  return (
    <article className="ph-panel relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-[var(--color-border-subtle)]">
        {ts !== null ? (
          <button
            type="button"
            onClick={() => onSeek(ts)}
            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] hover:underline"
          >
            ▶{" "}
            <span className="tabular-nums">{formatTime(ts)}</span>
          </button>
        ) : (
          <span className="ph-ref">sans timestamp</span>
        )}
        <span className="ph-ref shrink-0 truncate max-w-[50%]">
          {note.title}
        </span>
      </div>
      <p className="whitespace-pre-line px-3 py-2 text-xs leading-relaxed text-[var(--color-fg-secondary)]">
        {note.contentMarkdown}
      </p>
    </article>
  );
}
