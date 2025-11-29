"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export function LandingHeader() {
  const t = useTranslations("landing");
  const common = useTranslations("common");

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-cyan-500/10 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-emerald-300 to-sky-500 text-lg font-bold text-slate-900 shadow-md shadow-cyan-400/50">
          AE
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {t("headerTag")}
          </p>
          <p className="text-lg font-semibold text-white">{common("brand")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          href="/login"
          className="rounded-full border border-cyan-200/60 px-4 py-2 text-sm font-semibold text-cyan-50 transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-white/10"
        >
          {t("headerLogin")}
        </Link>
      </div>
    </header>
  );
}
