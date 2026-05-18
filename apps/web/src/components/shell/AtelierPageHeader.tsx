import Link from "next/link";

type Props = {
  eyebrow: string; // ex: "ATELIER · ROADMAP"
  title: string;
  subtitle?: string;
  ref?: string; // code de référence atelier
  backHref?: string;
  backLabel?: string;
};

export function AtelierPageHeader({
  eyebrow,
  title,
  subtitle,
  ref,
  backHref = "/",
  backLabel = "← Atelier",
}: Props) {
  return (
    <>
      <nav className="mb-3 font-mono text-xs sm:mb-6">
        <Link
          href={backHref}
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
        >
          {backLabel}
        </Link>
      </nav>

      <header className="ph-panel ph-rivets relative mb-6 overflow-hidden sm:mb-8">
        <span className="ph-rivet-tl" />
        <span className="ph-rivet-tr" />

        <div className="ph-station-header flex items-center justify-between px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-fg-secondary)]">
            {eyebrow}
          </span>
          {ref && <span className="ph-ref">{ref}</span>}
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-secondary)] sm:mt-3">
              {subtitle}
            </p>
          )}
        </div>
      </header>
    </>
  );
}
