"use client";

import { useEffect, useState } from "react";

const ASCII_TITLE = `
 ██████╗ ██████╗ ██████╗ ███████╗     ███╗   ██╗ ██████╗ ██╗██████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝     ████╗  ██║██╔═══██╗██║██╔══██╗
██║     ██║   ██║██║  ██║█████╗       ██╔██╗ ██║██║   ██║██║██████╔╝
██║     ██║   ██║██║  ██║██╔══╝       ██║╚██╗██║██║   ██║██║██╔══██╗
╚██████╗╚██████╔╝██████╔╝███████╗     ██║ ╚████║╚██████╔╝██║██║  ██║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝     ╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═╝
`;

const BOOT_LINES: Array<{ text: string; tone: "info" | "ok" | "warn" }> = [
  { text: "$ ./bootstrap --noir", tone: "info" },
  { text: "[ OK ] tcp/ip stack initialized", tone: "ok" },
  { text: "[ OK ] establishing encrypted tunnel...", tone: "info" },
  { text: "[ OK ] handshake complete (TLS 1.3)", tone: "ok" },
  { text: "[ OK ] verifying identity: erwin@porterfield", tone: "ok" },
  { text: "[ .. ] decrypting techniques archive...", tone: "info" },
  { text: "[ OK ] 32 techniques loaded", tone: "ok" },
  { text: "[ !! ] WARNING: offensive content ahead", tone: "warn" },
  { text: "[ OK ] sandbox isolation: ON", tone: "ok" },
  { text: "$ ACCESS GRANTED", tone: "ok" },
];

const SESSION_KEY = "ph_code_noir_boot_seen";

export function CodeNoirBoot({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(true); // par défaut on saute (SSR-safe)
  const [skipped, setSkipped] = useState(false);

  // Au mount : si sessionStorage flag absent → joue la séquence
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    setDone(false);
    setStep(0);
  }, []);

  // Avance les lignes une par une
  useEffect(() => {
    if (done) return;
    if (step >= BOOT_LINES.length) {
      // Tient l'écran 600ms à ACCESS GRANTED puis fade out
      const t = window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setDone(true);
      }, 700);
      return () => window.clearTimeout(t);
    }
    const line = BOOT_LINES[step];
    const delay = line?.tone === "info" ? 280 : line?.text.startsWith("[ .. ]") ? 600 : 180;
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    return () => window.clearTimeout(id);
  }, [step, done]);

  // Skip handler : click / espace / Escape
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "Spacebar"
      ) {
        e.preventDefault();
        setSkipped(true);
      }
    };
    const onClick = () => setSkipped(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [done]);

  useEffect(() => {
    if (!skipped) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setDone(true);
  }, [skipped]);

  if (done) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black ph-noir-scan"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-4xl px-4 sm:px-8">
        {/* ASCII art title */}
        <pre className="ph-noir-flicker hidden text-[8px] leading-[0.95] text-[#00ff88] ph-noir-glow sm:block sm:text-[10px] md:text-[12px]">
          {ASCII_TITLE}
        </pre>
        <pre className="ph-noir-flicker text-[10px] leading-[0.95] text-[#00ff88] ph-noir-glow sm:hidden">
          {`█▀▀ █▀█ █▀▄ █▀▀\n█▄▄ █▄█ █▄▀ ██▄\n█▄░█ █▀█ █ █▀█\n█░▀█ █▄█ █ █▀▄`}
        </pre>

        {/* Boot log */}
        <div className="mt-6 font-mono text-xs sm:text-sm">
          {BOOT_LINES.slice(0, step).map((line, i) => {
            const tone =
              line.tone === "ok"
                ? "text-[#00ff88]"
                : line.tone === "warn"
                  ? "text-[rgba(255,200,80,0.9)]"
                  : "text-[rgba(0,255,136,0.7)]";
            return (
              <p key={i} className={`${tone} leading-relaxed`}>
                {line.text}
              </p>
            );
          })}
          {step < BOOT_LINES.length && (
            <span className="text-[#00ff88]">
              <span className="ph-loader-cursor" style={{ background: "#00ff88" }} />
            </span>
          )}
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-[rgba(0,255,136,0.4)]">
          press space / click to skip
        </p>
      </div>
    </div>
  );
}
