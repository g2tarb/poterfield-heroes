"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RadarChart12, type RadarAxis } from "./RadarChart12";

export function StatsClient() {
  const [radar, setRadar] = useState<RadarAxis[] | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const r = await apiFetch<RadarAxis[]>("/api/progress/radar");
        setRadar(r);
      } catch (err) {
        console.error("[stats] failed", err);
      }
    })();
  }, []);

  if (!radar) {
    return <p className="text-[var(--color-fg-muted)]">Chargement…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
      <div className="flex items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-6 md:p-10">
        <RadarChart12 axes={radar} size={420} />
      </div>
      <ul className="space-y-1.5">
        {radar.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs"
          >
            <span className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ background: a.colorHex }}
              />
              <span className="text-[var(--color-fg-secondary)]">{a.label}</span>
            </span>
            <span className="font-mono tabular-nums text-[var(--color-fg-muted)]">
              {a.score}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
