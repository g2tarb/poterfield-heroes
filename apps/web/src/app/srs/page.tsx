import { SrsReviewer } from "@/components/srs/SrsReviewer";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "Révisions SRS" };

export default function SrsPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Mémoire long-terme"
        title="Révisions du jour"
        subtitle="Algorithme FSRS-4. Réponds honnêtement — c'est l'auto-tromperie qui te coûte la rétention, pas l'échec."
        ref="SRS"
      />
      <SrsReviewer />
    </main>
  );
}
