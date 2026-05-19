"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { Markdown } from "@/components/coach/Markdown";

type TechniqueProgress = {
  status: "in_progress" | "mastered";
  quizScore: number | null;
  masteredAt: string | null;
};

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
  youtubeSearch?: string;
  youtubeIds?: string[];
  progress: TechniqueProgress | null;
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
      <div className="ph-noir-card p-6 text-center text-sm text-[rgba(0,255,136,0.7)]">
        <p className="font-mono">
          <span
            className="ph-loader-cursor"
            style={{ background: "#00ff88" }}
            aria-hidden
          />{" "}
          $ decrypting techniques...
        </p>
      </div>
    );
  }

  return (
    <>
      <nav className="mb-6 flex gap-2 border-b border-[rgba(0,255,136,0.2)]">
        <TabButton
          active={tab === "techniques"}
          onClick={() => setTab("techniques")}
        >
          $ skill tree [{state.unlocked.length}/{state.totalTechniques}]
        </TabButton>
        <TabButton active={tab === "mentor"} onClick={() => setTab("mentor")}>
          $ ./mentor
        </TabButton>
      </nav>

      {tab === "techniques" ? (
        <SkillTreeView state={state} />
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
      style={{ minHeight: 40 }}
    >
      {children}
    </button>
  );
}

// =============================================================
// SKILL TREE VIEW
// =============================================================

type NodeStatus = "locked" | "available" | "in_progress" | "mastered";

type TreeNode = {
  slug: string;
  title: string;
  kind: "offensive" | "defensive" | "duo";
  moduleNumber: number;
  status: NodeStatus;
};

function SkillTreeView({ state }: { state: State }) {
  const masteredCount = state.unlocked.filter(
    (t) => t.progress?.status === "mastered",
  ).length;

  // Compute the "next target" = first unlocked, not mastered, in module order.
  const sortedUnlocked = useMemo(
    () => [...state.unlocked].sort((a, b) => a.moduleNumber - b.moduleNumber),
    [state.unlocked],
  );

  const nextTarget = useMemo(
    () =>
      sortedUnlocked.find((t) => t.progress?.status !== "mastered") ?? null,
    [sortedUnlocked],
  );

  // Group by module number (only modules that have at least one technique)
  const groupedByModule = useMemo(() => {
    const map = new Map<
      number,
      Array<TreeNode>
    >();

    for (const t of state.unlocked) {
      const node: TreeNode = {
        slug: t.slug,
        title: t.title,
        kind: t.kind,
        moduleNumber: t.moduleNumber,
        status:
          t.progress?.status === "mastered"
            ? "mastered"
            : t.progress?.status === "in_progress"
              ? "in_progress"
              : "available",
      };
      const arr = map.get(t.moduleNumber) ?? [];
      arr.push(node);
      map.set(t.moduleNumber, arr);
    }
    for (const l of state.locked) {
      const node: TreeNode = {
        slug: l.slug,
        title: l.title,
        kind: l.kind,
        moduleNumber: l.moduleNumber,
        status: "locked",
      };
      const arr = map.get(l.moduleNumber) ?? [];
      arr.push(node);
      map.set(l.moduleNumber, arr);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([moduleNumber, nodes]) => ({ moduleNumber, nodes }));
  }, [state.unlocked, state.locked]);

  return (
    <div className="space-y-6">
      {/* Status header */}
      <div className="ph-noir-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.5)]">
          ╳ STATUS
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span>
            Code Noir —{" "}
            <span className="ph-noir-glow font-bold">
              {masteredCount}/{state.totalTechniques}
            </span>{" "}
            maîtrisées
          </span>
          <span className="text-[rgba(0,255,136,0.6)]">
            · module actif M{String(state.currentModule).padStart(2, "0")}
          </span>
          <span className="text-[rgba(0,255,136,0.6)]">
            · {state.unlocked.length} débloquée(s)
          </span>
        </div>
      </div>

      {/* Next target card */}
      {nextTarget && (
        <NextTargetCard technique={nextTarget} />
      )}

      {/* Skill path */}
      <div className="space-y-8">
        {groupedByModule.map(({ moduleNumber, nodes }) => (
          <ModuleSection
            key={moduleNumber}
            moduleNumber={moduleNumber}
            nodes={nodes}
          />
        ))}
      </div>
    </div>
  );
}

function NextTargetCard({ technique }: { technique: Technique }) {
  const kindLabel =
    technique.kind === "offensive"
      ? "⚔ OFFENSIVE"
      : technique.kind === "defensive"
        ? "🛡 DEFENSIVE"
        : "⇋ DUO";
  return (
    <Link
      href={`/code-noir/${technique.slug}` as unknown as string}
      className="block"
    >
      <div className="ph-noir-card ph-noir-glow rounded border-2 border-[#00ff88] bg-[rgba(0,255,136,0.06)] p-5 transition hover:bg-[rgba(0,255,136,0.12)]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
          ► PROCHAINE CIBLE
        </p>
        <p className="mt-2 text-xs font-mono uppercase tracking-widest text-[rgba(0,255,136,0.7)]">
          M{String(technique.moduleNumber).padStart(2, "0")} · {kindLabel}
        </p>
        <h2 className="mt-2 text-xl font-bold uppercase tracking-wider text-[#00ff88] sm:text-2xl">
          {technique.title}
        </h2>
        <p className="mt-2 text-sm text-[rgba(0,255,136,0.85)]">
          {technique.oneLiner}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 border-2 border-[#00ff88] bg-black/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#00ff88]">
          <span aria-hidden>▶</span>
          <span>
            {technique.progress?.status === "in_progress"
              ? "reprendre"
              : "commencer"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModuleSection({
  moduleNumber,
  nodes,
}: {
  moduleNumber: number;
  nodes: TreeNode[];
}) {
  return (
    <section>
      <header className="mb-3 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[rgba(0,255,136,0.6)]">
          ▼ M{String(moduleNumber).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-[rgba(0,255,136,0.15)]" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.4)]">
          {nodes.filter((n) => n.status === "mastered").length}/{nodes.length}
        </span>
      </header>

      <ol className="relative space-y-4">
        {/* Trait vertical "chemin" */}
        <span
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgba(0,255,136,0.18)]"
          aria-hidden
        />
        {nodes.map((node, i) => (
          <li
            key={node.slug}
            className={`relative flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <TreeNodeCard node={node} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function TreeNodeCard({ node }: { node: TreeNode }) {
  const kindIcon =
    node.kind === "offensive" ? "⚔" : node.kind === "defensive" ? "🛡" : "⇋";

  if (node.status === "locked") {
    return (
      <div className="ph-noir-card-locked relative w-[80%] max-w-md rounded p-3 sm:w-[55%]">
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
          M{String(node.moduleNumber).padStart(2, "0")} · {kindIcon} ·{" "}
          🔒 LOCKED
        </p>
        <p className="mt-1 font-semibold blur-[2px] transition hover:blur-0">
          {node.title}
        </p>
      </div>
    );
  }

  const baseCls =
    "relative block w-[80%] max-w-md rounded p-3 transition sm:w-[55%]";
  const stateCls =
    node.status === "mastered"
      ? "ph-noir-card border-2 border-[#00ff88] bg-[rgba(0,255,136,0.08)]"
      : node.status === "in_progress"
        ? "ph-noir-card ph-noir-glow border-2 border-[#00ff88] bg-[rgba(0,255,136,0.04)]"
        : "ph-noir-card hover:bg-[rgba(0,255,136,0.05)]";

  const icon =
    node.status === "mastered" ? "⚑" : node.status === "in_progress" ? "▶" : "▶";

  const tag =
    node.status === "mastered"
      ? "✓ MAÎTRISÉE"
      : node.status === "in_progress"
        ? "· EN COURS"
        : null;

  return (
    <Link
      href={`/code-noir/${node.slug}` as unknown as string}
      className={`${baseCls} ${stateCls}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.55)]">
        M{String(node.moduleNumber).padStart(2, "0")} · {kindIcon}
        {tag && (
          <span
            className={`ml-2 ${
              node.status === "mastered"
                ? "text-[#00ff88]"
                : "text-[rgba(0,255,136,0.8)]"
            }`}
          >
            {tag}
          </span>
        )}
      </p>
      <div className="mt-1 flex items-start gap-2">
        <span
          className={`shrink-0 font-mono text-base ${
            node.status === "mastered" ? "text-[#00ff88]" : "text-[#00ff88]"
          }`}
          aria-hidden
        >
          {icon}
        </span>
        <p className="text-sm font-bold text-[rgba(0,255,136,0.95)]">
          {node.title}
        </p>
      </div>
    </Link>
  );
}

// =============================================================
// MENTOR CHAT (inchangé)
// =============================================================

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
            <p className="mt-3 text-xs">
              Pose une question sur les techniques débloquées. Ex :
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>{"> "}Donne-moi le payload XSS qui bypass DOMPurify v3.0.</li>
              <li>
                {"> "}Comment exploiter SSRF vers IMDSv1 avec curl, étape par
                étape ?
              </li>
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
          <p className="font-mono text-xs text-[rgba(0,255,136,0.5)]">
            $ mentor thinking...
          </p>
        )}
        {error && (
          <p className="font-mono text-xs text-[rgba(255,80,80,0.8)]">
            $ ERROR: {error}
          </p>
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
          style={{ minHeight: 40 }}
        >
          send
        </button>
      </div>
    </div>
  );
}
