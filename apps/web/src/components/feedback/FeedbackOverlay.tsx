"use client";

import { useEffect, useState } from "react";
import {
  FEEDBACK_EVENTS,
  type XpBurstDetail,
  type SuccessBurstDetail,
} from "@/lib/feedback";

type XpItem = {
  id: string;
  kind: "xp";
  amount: number;
  ts: number;
};

type ConfettiItem = {
  id: string;
  kind: "confetti";
  origin: { x: number; y: number };
  message?: string;
  ts: number;
};

type Item = XpItem | ConfettiItem;

const XP_LIFESPAN = 2200;
const CONFETTI_LIFESPAN = 1800;

let counter = 0;
function nextId(): string {
  counter += 1;
  return `${Date.now()}-${counter}`;
}

export function FeedbackOverlay() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const onXp = (e: Event) => {
      const d = (e as CustomEvent<XpBurstDetail>).detail;
      if (!d || d.amount <= 0) return;
      setItems((prev) => [
        ...prev,
        { id: nextId(), kind: "xp", amount: d.amount, ts: Date.now() },
      ]);
    };

    const onSuccess = (e: Event) => {
      const d = (e as CustomEvent<SuccessBurstDetail>).detail;
      const origin = d.origin ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      setItems((prev) => [
        ...prev,
        {
          id: nextId(),
          kind: "confetti",
          origin,
          ...(d.message !== undefined ? { message: d.message } : {}),
          ts: Date.now(),
        },
      ]);
      // Vibration tactile mobile (silencieuse en live)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([30, 40, 60]);
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener(FEEDBACK_EVENTS.XP, onXp);
    window.addEventListener(FEEDBACK_EVENTS.SUCCESS, onSuccess);
    return () => {
      window.removeEventListener(FEEDBACK_EVENTS.XP, onXp);
      window.removeEventListener(FEEDBACK_EVENTS.SUCCESS, onSuccess);
    };
  }, []);

  // Garbage collection des items expirés
  useEffect(() => {
    if (items.length === 0) return;
    const id = window.setInterval(() => {
      const now = Date.now();
      setItems((prev) =>
        prev.filter((it) => {
          const span = it.kind === "xp" ? XP_LIFESPAN : CONFETTI_LIFESPAN;
          return now - it.ts < span;
        }),
      );
    }, 600);
    return () => window.clearInterval(id);
  }, [items.length]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {items.map((it) =>
        it.kind === "xp" ? (
          <XpToast key={it.id} amount={it.amount} index={items.indexOf(it)} />
        ) : (
          <ConfettiBurst key={it.id} origin={it.origin} message={it.message} />
        ),
      )}
    </div>
  );
}

function XpToast({ amount, index }: { amount: number; index: number }) {
  const offsetY = index * 44;
  return (
    <div
      className="ph-xp-toast pointer-events-none absolute left-1/2 top-20 -translate-x-1/2"
      style={{ transform: `translate(-50%, ${offsetY}px)` }}
    >
      <div className="ph-stamp ph-stamp-active flex items-center gap-1.5 whitespace-nowrap bg-[var(--color-bg-base)]/90 px-3 py-1.5 text-base shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_24px_color-mix(in_oklab,var(--color-accent),transparent_60%)] backdrop-blur-md">
        <span className="text-xl">⚡</span>
        <span className="font-mono tabular-nums">+{amount}</span>
        <span className="text-[var(--color-fg-muted)]">XP</span>
      </div>
    </div>
  );
}

const CONFETTI_COUNT = 14;
const CONFETTI_COLORS = [
  "var(--color-accent)",
  "var(--color-success)",
  "var(--color-warning)",
  "oklch(0.78 0.18 200)",
  "oklch(0.78 0.18 330)",
];

function ConfettiBurst({
  origin,
  message,
}: {
  origin: { x: number; y: number };
  message?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: origin.x, top: origin.y }}
    >
      {message && (
        <div className="ph-confetti-message absolute left-0 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border-2 border-[var(--color-success)] bg-[var(--color-bg-base)]/90 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-success)] shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {message}
        </div>
      )}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const angle = (i / CONFETTI_COUNT) * Math.PI * 2;
        const dist = 60 + (i % 3) * 28;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "var(--color-accent)";
        const size = 6 + (i % 3) * 2;
        const delay = (i % 4) * 30;
        return (
          <span
            key={i}
            className="ph-confetti-particle absolute block"
            style={
              {
                left: 0,
                top: 0,
                width: size,
                height: size,
                background: color,
                borderRadius: i % 2 === 0 ? "1px" : "50%",
                "--dx": `${dx}px`,
                "--dy": `${dy}px`,
                animationDelay: `${delay}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
