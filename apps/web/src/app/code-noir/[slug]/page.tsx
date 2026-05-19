import Link from "next/link";
import { CodeNoirLessonClient } from "./LessonClient";

export const metadata = {
  title: "Code Noir — leçon",
  robots: { index: false, follow: false },
};

export default async function CodeNoirLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="ph-noir ph-noir-scan relative">
      <div
        className="mx-auto max-w-3xl px-4 py-6 sm:px-6"
        style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <nav className="mb-4 text-xs">
          <Link
            href="/code-noir"
            className="text-[rgba(0,255,136,0.6)] hover:text-[#00ff88]"
          >
            ← Code Noir
          </Link>
        </nav>
        <CodeNoirLessonClient slug={slug} />
      </div>
    </main>
  );
}
