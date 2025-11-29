import Link from "next/link";
import { cookies, headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getMessages, localeCookieName, pickLocale } from "@/i18n";
import { LandingHeader } from "@/sections/landing/landing-header";

const featureIcons = {
  visibility: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M4 12c1.5-3 4.5-5 8-5s6.5 2 8 5c-1.5 3-4.5 5-8 5s-6.5-2-8-5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M6 10.5c0-3.2 2.7-5.8 6-5.8s6 2.6 6 5.8V12c0 3.6-2.9 6.5-6.5 6.5S5 15.6 5 12v-1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 11.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v1.5c0 1.4-1.1 2.5-2.5 2.5S9.5 14.4 9.5 13v-1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  workflow: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M6 7h7c1.7 0 3 1.3 3 3v7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Zm0 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Zm9-5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10 15.5v-3a2.5 2.5 0 0 1 2.5-2.5H17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
};

export async function LandingPage() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = pickLocale({
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    acceptLanguage: headerList.get("accept-language")
  });
  const messages = await getMessages(locale);
  const t = await getTranslations({ locale, messages, namespace: "landing" });
  const features = ["visibility", "security", "workflow"] as const;
  const panelItems = ["automation", "security", "localization"] as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.16),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,116,144,0.24),transparent_40%)]" />
      <div className="absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute left-16 top-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-10 lg:px-10">
        <LandingHeader />

        <main className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-100 ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {t("tagline")}
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
              <p className="max-w-xl text-lg text-slate-200">{t("description")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/30 transition duration-150 hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                {t("primaryCta")}
              </Link>
              <a
                href="#features"
                className="rounded-full px-6 py-3 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-300/40 transition duration-150 hover:-translate-y-0.5 hover:bg-white/5"
              >
                {t("secondaryCta")}
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-200/80">
              {(["uptime", "deploys", "coverage"] as const).map(statKey => (
                <div
                  key={statKey}
                  className="flex min-w-[10rem] flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {t(`stats.${statKey}.value`)}
                    </p>
                    <p className="text-xs text-slate-300">
                      {t(`stats.${statKey}.label`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.16),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.12),transparent_35%)] blur-xl" />
            <div className="relative space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                {t("panel.title")}
              </p>
              <h2 className="text-2xl font-semibold text-white lg:text-3xl">
                {t("panel.heading")}
              </h2>
              <div className="space-y-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
                {panelItems.map(item => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <div>
                      <p className="font-semibold text-white">
                        {t(`panel.items.${item}.title`)}
                      </p>
                      <p className="text-sm text-slate-200">
                        {t(`panel.items.${item}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-cyan-50 ring-1 ring-white/10">
                <span>{t("panel.footer")}</span>
                <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {t("headerLogin")}
                </span>
              </div>
            </div>
          </div>
        </main>

        <section id="features" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {t("features.kicker")}
              </p>
              <h3 className="text-3xl font-semibold text-white">
                {t("features.title")}
              </h3>
              <p className="text-base text-slate-200">{t("features.subtitle")}</p>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100 ring-1 ring-white/10">
              {t("features.caption")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <div
                key={feature}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 transition duration-200 group-hover:opacity-100" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-200/30">
                  {featureIcons[feature]}
                </div>
                <h4 className="text-lg font-semibold text-white">
                  {t(`features.${feature}.title`)}
                </h4>
                <p className="mt-2 text-sm text-slate-200">
                  {t(`features.${feature}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
