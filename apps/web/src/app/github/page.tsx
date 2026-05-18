import { GithubPushList } from "@/components/github/GithubPushList";
import { AtelierPageHeader } from "@/components/shell/AtelierPageHeader";

export const metadata = { title: "GitHub" };

export default function GithubPage() {
  return (
    <main className="min-h-svh px-3 pb-8 pt-3 sm:px-6 lg:px-12 lg:pt-12 xl:px-24">
      <AtelierPageHeader
        eyebrow="Atelier · Code review IA"
        title="Reviews automatiques"
        subtitle="Quand tu push sur un repo tracké, Claude review le diff. Annotations inline + score sur 7 critères."
        ref="GITHUB"
      />
      <GithubPushList />
    </main>
  );
}
