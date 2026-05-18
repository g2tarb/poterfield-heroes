import { NotebookClient } from "@/components/notebook/NotebookClient";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "Carnet" };

export default function NotebookPage() {
  return (
    <main className="min-h-svh px-3 pb-4 pt-3 sm:px-6 sm:pb-8 sm:pt-4 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Carnet d'établi"
        title="Tes notes, vivantes."
        subtitle="Markdown. Indexées automatiquement pour que le coach les retrouve quand tu poses une question."
        ref="NOTEBOOK"
      />
      <NotebookClient />
    </main>
  );
}
