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

const SOURCE_LABEL = {
  coach: "Coach",
  user: "Libre",
  system: "Système",
} as const;

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

  const fetchEntries = useCallback(async () => {
    try {
      const qs =
        moduleFilter !== "all" ? `?moduleId=${moduleFilter}` : "";
      const rows = await apiFetch<Entry[]>(`/api/notebook${qs}`);
      setEntries(rows);
    } catch (e) {
      setError((e as Error).message);
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
        // ignore
      }
    })();
  }, []);

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) {
      setEditing({ title: selected.title, content: selected.contentMarkdown });
    }
  }, [selectedId, selected]);

  // Debounced auto-save
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
          contentMarkdown: "Commence à écrire ici…",
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr] md:gap-6">
      {/* Sidebar */}
      <aside className="md:max-h-[75vh] md:overflow-y-auto">
        <div className="mb-3 flex items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="flex-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2 py-1.5 text-xs"
          >
            <option value="all">Tous modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                M{String(m.moduleNumber).padStart(2, "0")} · {m.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={createNew}
            className="shrink-0 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-accent-fg)]"
          >
            +
          </button>
        </div>

        <ul className="space-y-1">
          {entries.length === 0 && (
            <li className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3 text-xs text-[var(--color-fg-muted)]">
              Aucune note. Crée la première via +.
            </li>
          )}
          {entries.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setSelectedId(e.id)}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-left transition",
                  selectedId === e.id
                    ? "border-[var(--color-accent)] bg-[var(--color-bg-high)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]",
                )}
              >
                <p className="truncate text-sm font-semibold">{e.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {SOURCE_LABEL[e.source]}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <section className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
        {!selected ? (
          <div className="p-8 text-center text-[var(--color-fg-secondary)]">
            Sélectionne une note ou crée la première.
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, title: e.target.value }))
                }
                className="flex-1 bg-transparent text-lg font-semibold focus:outline-none"
                placeholder="Titre de la note"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  className="rounded-md border border-[var(--color-border-strong)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider hover:border-[var(--color-accent)]"
                >
                  {preview ? "Éditer" : "Aperçu"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(selected.id)}
                  className="rounded-md border border-[var(--color-border-strong)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider hover:border-[var(--color-danger)]"
                >
                  Suppr
                </button>
              </div>
            </header>

            <div className="min-h-[400px] flex-1 p-4">
              {preview ? (
                <div className="prose-coach">
                  <Markdown source={editing.content} />
                </div>
              ) : (
                <textarea
                  value={editing.content}
                  onChange={(e) =>
                    setEditing((s) => ({ ...s, content: e.target.value }))
                  }
                  className="h-full min-h-[400px] w-full resize-none bg-transparent font-mono text-sm leading-relaxed focus:outline-none"
                  placeholder="Markdown…"
                />
              )}
            </div>

            <footer className="border-t border-[var(--color-border-subtle)] px-4 py-2 font-mono text-[10px] text-[var(--color-fg-muted)]">
              {saving ? "Enregistrement…" : "Auto-save activé · 1.2s"}
              {error && (
                <span className="ml-3 text-[var(--color-danger)]">{error}</span>
              )}
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}
