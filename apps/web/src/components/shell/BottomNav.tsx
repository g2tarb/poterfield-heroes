"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Atelier", icon: "🪜" },
  { href: "/sandbox", label: "Sandbox", icon: "▶" },
  { href: "/srs", label: "SRS", icon: "🧠" },
  { href: "/notebook", label: "Carnet", icon: "📓" },
  { href: "/settings", label: "Réglages", icon: "⚙️" },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-mono uppercase tracking-wider transition active:scale-90 ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                }`}
              >
                <span
                  className={`text-xl transition-transform ${active ? "scale-110" : ""}`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--color-accent)]"
                    aria-hidden
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
