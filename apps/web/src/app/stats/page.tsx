import { StatsClient } from "@/components/dashboard/StatsClient";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "Stats" };

export default function StatsPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Mesures"
        title="Radar mastery 12 axes"
        subtitle="Pondéré par contribution skill × pourcentage de mastery."
        ref="STATS"
      />
      <StatsClient />
    </main>
  );
}
