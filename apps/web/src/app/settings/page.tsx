import { SettingsClient } from "@/components/settings/SettingsClient";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "Réglages" };

export default function SettingsPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Configuration"
        title="Réglages"
        subtitle="Préférences, budget IA, actions destructives."
        refCode="CONFIG"
      />
      <SettingsClient />
    </main>
  );
}
