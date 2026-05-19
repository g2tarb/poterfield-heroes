"use client";

// Wrapper qui charge Sandbox (et donc CodeMirror + worker hooks) en lazy.
// Évite que les modules de CodeMirror + le bundle Pyodide soient inclus dans
// le First Load JS des pages qui n'en ont pas besoin.

import dynamic from "next/dynamic";
import { PorterfieldLoader } from "@/components/ambient/PorterfieldLoader";

type Language = "javascript" | "typescript" | "python";

type Props = {
  initialCode?: string;
  language?: Language;
  title?: string;
  allowLanguageSwitch?: boolean;
};

export const LazySandbox = dynamic<Props>(
  () => import("./Sandbox").then((m) => ({ default: m.Sandbox })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center">
        <PorterfieldLoader withProgress label="> sandbox.boot()" />
      </div>
    ),
  },
);
