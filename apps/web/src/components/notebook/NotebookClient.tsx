"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";
import { cn } from "@/lib/cn";

type Entry = {
  id: string;
  moduleId: string | null;
  skillId: string | null;
  source: "coach" | "user" | "system";
  title: string;
  contentMarkdown: string;
  tags: string[];
  starred: number;
  createdAt: string;
  updatedAt: string;
};

type Module = { id: string; moduleNumber: number; title: string };

const SOURCE_META = {
  coach: { label: "Coach", icon: "💬", color: "text-[var(--color-accent)]" },
  user: { label: "Libre", icon: "✏️", color: "text-[var(--color-fg-muted)]" },
  system: { label: "Système", icon: "⚙️", color: "text-[var(--color-fg-muted)]" },
} as const;

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export function NotebookClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const qs = moduleFilter !== "all" ? `?moduleId=${moduleFilter}` : "";
      const rows = await apiFetch<Entry[]>(`/api/notebook${qs}`);
      setEntries(rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [moduleFilter]);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await apiFetch<Module[]>("/api/modules");
        setModules(rows);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) {
      setEditing({ title: selected.title, content: selected.contentMarkdown });
    }
  }, [selectedId, selected]);

  useEffect(() => {
    if (!selected) return;
    if (
      editing.title === selected.title &&
      editing.content === selected.contentMarkdown
    )
      return;

    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        const updated = await apiFetch<Entry>(`/api/notebook/${selected.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: editing.title,
            contentMarkdown: editing.content,
          }),
        });
        setEntries((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e)),
        );
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setSaving(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [editing, selected]);

  async function createNew() {
    try {
      const created = await apiFetch<Entry>("/api/notebook", {
        method: "POST",
        body: JSON.stringify({
          source: "user",
          title: "Nouvelle note",
          contentMarkdown: "",
          moduleId: moduleFilter !== "all" ? moduleFilter : null,
        }),
      });
      setEntries((prev) => [created, ...prev]);
      setSelectedId(created.id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette note ?")) return;
    try {
      await apiFetch<void>(`/api/notebook/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      if (e instanceof ApiError && e.status !== 204) {
        setError(e.message);
      }
    }
  }

  // Filter by search query
  const filteredEntries = query.trim()
    ? entries.filter((e) =>
        (e.title + " " + e.contentMarkdown)
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : entries;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-[300px_1fr] md:gap-6",
        // Sur mobile : si une note est ouverte, on cache la liste
        selected && "max-md:[&>aside]:hidden",
      )}
    >
      {/* Sidebar */}
      <aside className="space-y-2 sm:space-y-3 md:max-h-[calc(100svh-9rem)] md:overflow-y-auto">
        {/* Search */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher…"
          className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        {/* Module filter + New */}
        <div className="flex items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2 py-2 text-xs"
          >
            <option value="all">Tous les modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                M{String(m.moduleNumber).padStart(2, "0")} · {m.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={createNew}
            className="shrink-0 rounded-lg bg-[var(--color-accent)] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-fg)] transition active:scale-95"
            aria-label="Nouvelle note"
          >
            + Note
          </button>
        </div>

        {/* List */}
        <ul className="space-y-1.5">
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-16 animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]"
                />
              ))}
            </>
          )}
          {!loading && filteredEntries.length === 0 && entries.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--color-border-subtle)] p-6 text-center">
              <p className="text-2xl" aria-hidden>
                📓
              </p>
              <p className="mt-2 text-sm font-semibold">Carnet vide</p>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                Tes notes seront indexées par le coach.
              </p>
              <button
                type="button"
                onClick={createNew}
                className="mt-3 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-fg)]"
              >
                Première note
              </button>
            </li>
          )}
          {!loading &&
            filteredEntries.length === 0 &&
            entries.length > 0 && (
              <li className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3 text-xs text-[var(--color-fg-muted)]">
                Aucune note ne correspond à « {query} ».
              </li>
            )}
          {filteredEntries.map((e) => {
            const meta = SOURCE_META[e.source];
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(e.id)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-left transition active:scale-[0.99]",
                    selectedId === e.id
                      ? "border-[var(--color-accent)] bg-[var(--color-bg-high)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]",
                  )}
                >
                  <p className="truncate text-sm font-semibold">{e.title}</p>
                  <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider">
                    <span className={meta.color}>
                      <span className="mr-1">{meta.icon}</span>
                      {meta.label}
                    </span>
                    <span className="text-[var(--color-fg-muted)]">
                      {relativeDate(e.updatedAt)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Editor */}
      <section
        className={cn(
          "rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]",
          // Sur mobile : si pas sélectionné, cache l'éditeur
          !selected && "hidden md:block",
          // Sur mobile : full-screen quand une note est ouverte
          selected && "max-md:fixed max-md:inset-0 max-md:z-40 max-md:rounded-none max-md:border-0",
        )}
      >
        {!selected ? (
          <div className="grid h-full place-items-center p-8 text-center text-[var(--color-fg-secondary)]">
            <div>
              <p className="text-3xl" aria-hidden>
                ✍️
              </p>
              <p className="mt-3 text-sm">
                Sélectionne une note ou crée la première.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col max-md:h-svh">
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2.5">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="shrink-0 rounded-md px-2 py-1 text-base text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg-primary)] md:hidden"
                aria-label="Retour à la liste"
              >
                ←
              </button>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, title: e.target.value }))
                }
                className="min-w-0 flex-1 bg-transparent text-base font-semibold focus:outline-none sm:text-lg"
                placeholder="Titre"
              />
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition sm:px-2.5",
                    preview
                      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] hover:border-[var(--color-accent)]",
                  )}
                  aria-label={preview ? "Mode édition" : "Mode aperçu"}
                >
                  {preview ? "Éd." : "Aperçu"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(selected.id)}
                  className="rounded-md border border-[var(--color-border-strong)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] sm:px-2.5"
                  aria-label="Supprimer"
                >
                  🗑
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:min-h-[400px]">
              {preview ? (
                <Markdown source={editing.content || "_(note vide)_"} />
              ) : (
                <textarea
                  value={editing.content}
                  onChange={(e) =>
                    setEditing((s) => ({ ...s, content: e.target.value }))
                  }
                  className="h-full min-h-[300px] w-full resize-none bg-transparent font-mono text-sm leading-relaxed focus:outline-none md:min-h-[400px]"
                  placeholder="Markdown…"
                />
              )}
            </div>

            <footer className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 font-mono text-[10px] text-[var(--color-fg-muted)] sm:px-4">
              <span className="truncate">
                {saving ? (
                  <span className="text-[var(--color-accent)]">● Sauvegarde…</span>
                ) : (
                  <span>Auto-save · 1.2s</span>
                )}
              </span>
              {error ? (
                <span className="truncate text-[var(--color-danger)]">{error}</span>
              ) : (
                <span className="shrink-0">{relativeDate(selected.updatedAt)}</span>
              )}
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}
