"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const navItems = [
    { href: "/dashboard", label: tNav("dashboard") },
    { href: "/settings", label: tNav("settings") }
  ];

  return (
    <aside className="hidden w-64 flex-none border-r border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 lg:block">
      <div className="mb-6 text-xs font-semibold uppercase text-slate-500">
        {tCommon("navigation")}
      </div>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "block rounded-xl px-4 py-2 text-sm font-medium transition",
              pathname.startsWith(item.href)
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
