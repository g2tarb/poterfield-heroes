import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Accès" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get("ph_session")) {
    const params = await searchParams;
    redirect(params.redirect ?? "/");
  }

  const params = await searchParams;
  return (
    <main className="grid min-h-svh place-items-center px-4 sm:px-6">
      <div className="ph-panel ph-rivets relative w-full max-w-sm overflow-hidden">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />

        <header className="ph-station-header flex items-center justify-between px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
            Porterfield Heroes
          </span>
          <span className="ph-ref">AUTH</span>
        </header>

        <div className="px-5 py-6 sm:px-6 sm:py-8">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Atelier privé
          </h1>
          <p className="mt-2 text-xs text-[var(--color-fg-secondary)]">
            Mot de passe requis pour entrer.
          </p>

          <div className="mt-6">
            <LoginForm redirectTo={params.redirect ?? "/"} />
          </div>
        </div>
      </div>
    </main>
  );
}
