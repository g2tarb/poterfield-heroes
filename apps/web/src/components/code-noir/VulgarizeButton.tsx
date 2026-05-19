"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";

type Section = "hack" | "antiHack" | "oneLiner";

type Props = {
  slug: string;
  section: Section;
};

function cacheKey(slug: string, section: Section): string {
  return `ph:codenoir:eli5:${slug}:${section}`;
}

function readCache(slug: string, section: Section): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(cacheKey(slug, section));
  } catch {
    return null;
  }
}

function writeCache(slug: string, section: Section, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(cacheKey(slug, section), value);
  } catch {
    // ignore quota errors
  }
}

function clearCache(slug: string, section: Section): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(cacheKey(slug, section));
  } catch {
    // ignore
  }
}

export function VulgarizeButton({ slug, section }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore cached version on mount
  useEffect(() => {
    const cached = readCache(slug, section);
    if (cached) {
      setText(cached);
      setOpen(true);
    }
  }, [slug, section]);

  async function fetchVulgarize(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ vulgarized: string }>(
        "/api/code-noir/vulgarize",
        {
          method: "POST",
          body: JSON.stringify({ slug, section }),
        },
      );
      setText(res.vulgarized);
      writeCache(slug, section, res.vulgarized);
      setOpen(true);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur vulgarisation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function close(): void {
    setOpen(false);
  }

  function regenerate(): void {
    clearCache(slug, section);
    setText(null);
    void fetchVulgarize();
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-2 z-10 -mt-1 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (text && !open) {
              setOpen(true);
              return;
            }
            if (text && open) {
              close();
              return;
            }
            void fetchVulgarize();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-dashed border-[rgba(0,255,136,0.5)] bg-black/70 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#00ff88] backdrop-blur transition hover:bg-[rgba(0,255,136,0.08)] disabled:opacity-40"
          style={{ minHeight: 40 }}
          aria-expanded={open}
        >
          <span aria-hidden>🧠</span>
          <span>
            {loading
              ? "$ vulgarizing..."
              : text && open
                ? "fermer ELI5"
                : text
                  ? "afficher ELI5"
                  : "Vulgariser"}
          </span>
        </button>
      </div>

      {error && (
        <p className="font-mono text-xs text-[rgba(255,80,80,0.8)]">
          $ ERROR: {error}
        </p>
      )}

      {open && text && (
        <div className="rounded border border-dashed border-[rgba(0,255,136,0.4)] bg-[rgba(0,10,5,0.6)] p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
              // ELI5 — version pour ta sœur
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={regenerate}
                disabled={loading}
                className="border border-[rgba(0,255,136,0.4)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.8)] transition hover:bg-[rgba(0,255,136,0.08)] disabled:opacity-40"
                style={{ minHeight: 30 }}
              >
                regénérer
              </button>
              <button
                type="button"
                onClick={close}
                className="border border-[rgba(0,255,136,0.3)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.6)] transition hover:bg-[rgba(0,255,136,0.06)]"
                style={{ minHeight: 30 }}
              >
                fermer
              </button>
            </div>
          </div>
          <div className="prose-coach text-[rgba(0,255,136,0.9)]">
            <Markdown source={text} />
          </div>
        </div>
      )}
    </div>
  );
}
