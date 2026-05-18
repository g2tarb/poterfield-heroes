import { Sandbox } from "@/components/sandbox/Sandbox";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "Sandbox" };

export default function SandboxPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Bac à sable"
        title="Sandbox JavaScript"
        subtitle="Exécution isolée dans un Web Worker. Timeout 5s. Pas d'accès DOM. Pour expérimenter, débugger un snippet, vérifier une intuition."
        refCode="SANDBOX"
      />
      <Sandbox title="JS Runtime" />
    </main>
  );
}
