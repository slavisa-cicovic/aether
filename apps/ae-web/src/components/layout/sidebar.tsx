"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DashboardOutlined,
  PeopleOutline,
  SettingsOutlined
} from "@mui/icons-material";

export function Sidebar() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: "/dashboard", label: tNav("dashboard"), Icon: DashboardOutlined },
    { href: "/user", label: tNav("users"), Icon: PeopleOutline },
    { href: "/settings", label: tNav("settings"), Icon: SettingsOutlined }
  ];

  return (
    <aside
      className={clsx(
        "relative hidden h-screen flex-none border-r border-slate-200 bg-white/80 px-3 py-4 dark:border-slate-800 dark:bg-slate-900/60 lg:block",
        "transition-all duration-200 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed(prev => !prev)}
        className="absolute -right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
      </button>

      <div className="mb-6 flex justify-center">
        <Image
          src="/assets/icons/favicon.png"
          alt="App icon"
          width={96}
          height={96}
          className="rounded-lg shadow-sm"
          priority
        />
      </div>

      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
              pathname.startsWith(item.href)
                ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              collapsed && "justify-center px-2"
            )}
          >
            <item.Icon fontSize="small" />
            <span
              className={clsx(
                "whitespace-nowrap transition-all",
                collapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
