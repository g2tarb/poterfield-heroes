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
    <main className="grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm">
        <header className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            Porterfield Heroes
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Accès</h1>
          <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
            Atelier privé. Mot de passe requis.
          </p>
        </header>
        <LoginForm redirectTo={params.redirect ?? "/"} />
      </div>
    </main>
  );
}
