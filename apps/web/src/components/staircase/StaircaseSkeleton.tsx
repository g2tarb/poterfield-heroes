export function StaircaseSkeleton() {
  return (
    <div className="relative animate-pulse">
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--color-border-subtle)] lg:block"
        aria-hidden
      />
      <ol className="flex flex-col gap-4 lg:gap-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li
            key={i}
            className={`flex justify-center ${i % 2 === 0 ? "lg:justify-start" : "lg:justify-end"}`}
          >
            <div className="w-full max-w-md rounded-2xl border-2 border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="h-2.5 w-24 rounded bg-[var(--color-bg-high)]" />
                <div className="h-2.5 w-8 rounded bg-[var(--color-bg-high)]" />
              </div>
              <div className="mt-3 h-4 w-4/5 rounded bg-[var(--color-bg-high)]" />
              <div className="mt-2 h-3 w-3/5 rounded bg-[var(--color-bg-high)]" />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProgressionPanelSkeleton() {
  return (
    <aside className="animate-pulse space-y-6">
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5">
        <div className="flex items-baseline gap-3">
          <div className="size-10 rounded-full bg-[var(--color-bg-high)]" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-16 rounded bg-[var(--color-bg-high)]" />
            <div className="h-4 w-24 rounded bg-[var(--color-bg-high)]" />
          </div>
        </div>
        <div className="mt-5 h-1.5 rounded-full bg-[var(--color-bg-high)]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]" />
        <div className="h-20 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]" />
      </div>
    </aside>
  );
}
