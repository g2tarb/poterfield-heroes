"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";

type Technique = {
  slug: string;
  moduleNumber: number;
  kind: "offensive" | "defensive" | "duo";
  language: "js" | "python" | "both" | "concept";
  title: string;
  oneLiner: string;
  hack: string;
  antiHack: string;
  ctfRef?: string;
  cve?: string;
};

type Locked = {
  slug: string;
  title: string;
  moduleNumber: number;
  kind: "offensive" | "defensive" | "duo";
};

type State = {
  currentModule: number;
  totalTechniques: number;
  unlocked: Technique[];
  locked: Locked[];
};

type Tab = "techniques" | "mentor";

export function CodeNoirClient() {
  const [tab, setTab] = useState<Tab>("techniques");
  const [state, setState] = useState<State | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const s = await apiFetch<State>("/api/code-noir/state");
        setState(s);
      } catch (e) {
        setLoadError((e as Error).message);
      }
    })();
  }, []);

  if (loadError) {
    return (
      <div className="ph-noir-card p-4 text-sm">
        <p className="text-[rgba(255,0,80,0.8)]">$ ERROR: {loadError}</p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="ph-noir-card p-4 text-sm text-[rgba(0,255,136,0.6)]">
        $ loading techniques...
      </div>
    );
  }

  return (
    <>
      <nav className="mb-6 flex gap-2 border-b border-[rgba(0,255,136,0.2)]">
        <TabButton active={tab === "techniques"} onClick={() => setTab("techniques")}>
          $ techniques [{state.unlocked.length}/{state.totalTechniques}]
        </TabButton>
        <TabButton active={tab === "mentor"} onClick={() => setTab("mentor")}>
          $ ./mentor
        </TabButton>
      </nav>

      {tab === "techniques" ? (
        <TechniquesView state={state} />
      ) : (
        <MentorChat currentModule={state.currentModule} />
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-widest transition ${
        active
          ? "border-[#00ff88] text-[#00ff88] ph-noir-glow"
          : "border-transparent text-[rgba(0,255,136,0.5)] hover:text-[#00ff88]"
      }`}
    >
      {children}
    </button>
  );
}

function TechniquesView({ state }: { state: State }) {
  return (
    <div className="space-y-6">
      <div className="ph-noir-card p-4">
        <p className="text-xs uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
          ╳ STATUS
        </p>
        <p className="mt-2 text-sm">
          Module actif : <span className="ph-noir-glow font-bold">M{String(state.currentModule).padStart(2, "0")}</span>
        </p>
        <p className="mt-1 text-xs text-[rgba(0,255,136,0.5)]">
          {state.unlocked.length} technique(s) débloquée(s) · {state.locked.length} encore verrouillée(s)
        </p>
      </div>

      {/* Débloquées */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
          ▼ DÉBLOQUÉES
        </h2>
        <ul className="space-y-3">
          {state.unlocked.length === 0 && (
            <li className="ph-noir-card p-4 text-sm text-[rgba(0,255,136,0.5)]">
              Aucune technique débloquée. Avance dans les modules pour ouvrir le coffre.
            </li>
          )}
          {state.unlocked.map((t) => (
            <TechniqueCard key={t.slug} t={t} />
          ))}
        </ul>
      </section>

      {/* Verrouillées (teasers) */}
      {state.locked.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-widest text-[rgba(255,0,80,0.5)]">
            ╳ VERROUILLÉES
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {state.locked.map((l) => (
              <li
                key={l.slug}
                className="ph-noir-card-locked rounded p-3 text-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                  M{String(l.moduleNumber).padStart(2, "0")} · {l.kind}
                </p>
                <p className="mt-1 font-semibold blur-[2px] hover:blur-0 transition">
                  {l.title}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TechniqueCard({ t }: { t: Technique }) {
  const [open, setOpen] = useState(false);
  const kindLabel =
    t.kind === "offensive" ? "⚔ OFFENSIVE" : t.kind === "defensive" ? "🛡 DEFENSIVE" : "⇋ DUO";
  return (
    <li className="ph-noir-card rounded">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-baseline justify-between gap-3 px-4 py-3 text-left transition hover:bg-[rgba(0,255,136,0.05)]"
      >
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
            M{String(t.moduleNumber).padStart(2, "0")} · {kindLabel} · {t.language.toUpperCase()}
          </p>
          <p className="mt-1 text-sm font-bold ph-noir-glow">{t.title}</p>
          <p className="mt-1 text-xs text-[rgba(0,255,136,0.7)]">{t.oneLiner}</p>
        </div>
        <span className="shrink-0 text-xs">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-[rgba(0,255,136,0.2)] p-4 text-sm">
          <section>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[rgba(255,80,80,0.8)]">
              ⚔ HACK
            </p>
            <div className="prose-coach text-[rgba(0,255,136,0.85)]">
              <Markdown source={t.hack} />
            </div>
          </section>
          <section>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#00ff88]">
              🛡 ANTI-HACK
            </p>
            <div className="prose-coach text-[rgba(0,255,136,0.85)]">
              <Markdown source={t.antiHack} />
            </div>
          </section>
          {(t.ctfRef || t.cve) && (
            <div className="space-y-1 border-t border-[rgba(0,255,136,0.2)] pt-3 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
              {t.ctfRef && <p>► CTF : {t.ctfRef}</p>}
              {t.cve && <p className="text-[rgba(255,80,80,0.7)]">► CVE : {t.cve}</p>}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function MentorChat({ currentModule: _cur }: { currentModule: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!input.trim() || sending) return;
    const question = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setSending(true);
    setError(null);
    try {
      const res = await apiFetch<{ answer: string }>("/api/code-noir/ask", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Erreur mentor";
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ph-noir-card flex h-[70vh] flex-col rounded">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-sm text-[rgba(0,255,136,0.5)]">
            <p>$ Black Hat Mentor en attente…</p>
            <p className="mt-3 text-xs">Pose une question sur les techniques débloquées. Ex :</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>{"> "}Donne-moi le payload XSS qui bypass DOMPurify v3.0.</li>
              <li>{"> "}Comment exploiter SSRF vers IMDSv1 avec curl, étape par étape ?</li>
              <li>{"> "}Explique Log4Shell — la mécanique exacte JNDI + payload.</li>
              <li>{"> "}sqlmap : options pour bypass un WAF Cloudflare ?</li>
              <li>{"> "}Décortique le CVE Heartbleed (commit fix + payload).</li>
            </ul>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "rounded border border-[rgba(0,255,136,0.3)] p-3 text-sm"
                : "rounded border border-[rgba(0,255,136,0.15)] bg-[rgba(0,255,136,0.05)] p-3 text-sm"
            }
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
              {m.role === "user" ? "$ erwin" : "$ mentor"}
            </p>
            {m.role === "user" ? (
              <p>{m.content}</p>
            ) : (
              <div className="prose-coach text-[rgba(0,255,136,0.9)]">
                <Markdown source={m.content} />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <p className="font-mono text-xs text-[rgba(0,255,136,0.5)]">$ mentor thinking...</p>
        )}
        {error && (
          <p className="font-mono text-xs text-[rgba(255,80,80,0.8)]">$ ERROR: {error}</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-[rgba(0,255,136,0.2)] p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          disabled={sending}
          placeholder="$ Pose ta question…"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-[#00ff88] placeholder:text-[rgba(0,255,136,0.3)] focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending || !input.trim()}
          className="shrink-0 border-2 border-[#00ff88] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.1)] disabled:opacity-30"
        >
          send
        </button>
      </div>
    </div>
  );
}
