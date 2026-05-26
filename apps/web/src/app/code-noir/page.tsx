import Link from "next/link";
import { CodeNoirClient } from "./CodeNoirClient";
import { CodeNoirBoot } from "@/components/code-noir/CodeNoirBoot";

export const metadata = {
  title: "Code Noir",
  robots: { index: false, follow: false },
};

export default function CodeNoirPage() {
  return (
    <CodeNoirBoot>
    <main className="ph-noir ph-noir-scan relative">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <nav className="mb-6 text-xs">
          <Link
            href="/"
            className="text-[rgba(0,255,136,0.5)] hover:text-[#00ff88]"
          >
            $ cd /atelier &nbsp; <span className="opacity-60">← retour</span>
          </Link>
        </nav>

        <header className="mb-10 ph-noir-flicker">
          <p className="text-xs uppercase tracking-[0.4em] text-[rgba(0,255,136,0.5)]">
            ╳ CLASSIFIED ╳
          </p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-wider ph-noir-glow sm:text-5xl">
            CODE NOIR
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[rgba(0,255,136,0.7)]">
            Sécurité offensive ET défensive. Tu n'apprends ici que ce que tu as
            déjà acquis ailleurs. Pas de spoil. Pas de cheats.
            <br />
            <span className="text-[rgba(255,0,80,0.6)]">
              Usage : CTF, recherche, défense de TES systèmes. Pas autre chose.
            </span>
          </p>
        </header>

        <CodeNoirClient />
      </div>
    </main>
    </CodeNoirBoot>
  );
}
