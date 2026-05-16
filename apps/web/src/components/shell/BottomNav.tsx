"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Atelier", icon: "🪜" },
  { href: "/notebook", label: "Carnet", icon: "📓" },
  { href: "/stats", label: "Stats", icon: "📊" },
  { href: "/settings", label: "Réglages", icon: "⚙️" },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-wider transition ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
