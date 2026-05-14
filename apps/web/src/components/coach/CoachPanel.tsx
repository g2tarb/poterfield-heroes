"use client";

import { useState, useRef, useEffect } from "react";
import { useCoachStream } from "@/hooks/useCoachStream";
import { Markdown } from "./Markdown";
import { cn } from "@/lib/cn";

type Props = {
  moduleId?: string;
};

export function CoachPanel({ moduleId }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, streaming, send, stop, error } = useCoachStream();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  function autoResize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    send({ message: msg, ...(moduleId ? { moduleId } : {}) });
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le coach" : "Ouvrir le coach"}
        className={cn(
          "fixed right-4 bottom-4 z-40 size-12 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] font-mono text-xs uppercase tracking-wider text-[var(--color-fg-primary)] shadow-lg transition hover:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
          open && "border-[var(--color-accent)]",
        )}
      >
        {open ? "×" : "?"}
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-30 flex h-svh w-full flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] transition-transform md:w-[420px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              Coach
            </p>
            <p className="text-sm">
              {moduleId ? "Contextualisé sur ce module" : "Atelier général"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            aria-label="Fermer"
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && !streaming && (
            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-fg-secondary)]">
              <p className="mb-2 font-semibold text-[var(--color-fg-primary)]">
                À ton service.
              </p>
              <p>
                Pose-moi une question, fais-moi reviewer un code, ou dis-moi
                où tu bloques. Je suis contexte-aware sur le module en cours.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "rounded-lg p-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-6 border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] text-[var(--color-fg-primary)]"
                  : "mr-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-primary)]",
              )}
            >
              {m.role === "assistant" ? (
                <Markdown source={m.content || "_(en cours…)_"} />
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          ))}

          {error && (
            <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-bg-elevated)] p-3 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--color-border-subtle)] p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Pose ta question ou colle ton code…"
              rows={1}
              className="min-h-[40px] flex-1 resize-none rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-accent)] focus:outline-none"
            />
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="shrink-0 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-bg-high)] px-3 py-2 text-xs font-mono uppercase tracking-wider hover:border-[var(--color-danger)]"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={input.trim().length === 0}
                className="shrink-0 rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-mono uppercase tracking-wider text-[var(--color-accent-fg)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Envoyer
              </button>
            )}
          </div>
          <p className="mt-2 font-mono text-[10px] text-[var(--color-fg-muted)]">
            ↵ envoyer · ⇧↵ retour à la ligne
          </p>
        </form>
      </aside>
    </>
  );
}
