"use client";

import { useEffect, useState } from "react";
import { PorterfieldLoader } from "./PorterfieldLoader";

const SESSION_KEY = "ph_boot_splash_shown";
const BOOT_DURATION_MS = 5000;

export function BootSplash({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const already = sessionStorage.getItem(SESSION_KEY);
    if (already === "1") return;
    setReady(false);
    const id = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setReady(true);
    }, BOOT_DURATION_MS);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) {
    return (
      <PorterfieldLoader
        fullscreen
        size="lg"
        withProgress
        minDurationMs={BOOT_DURATION_MS}
      />
    );
  }

  return <>{children}</>;
}
