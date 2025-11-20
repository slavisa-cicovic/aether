import en from "@/messages/en.json";

export const locales = ["en", "sr-Latn", "sr-Cyrl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "sr-Latn": "Srpski (latinica)",
  "sr-Cyrl": "Српски (ћирилица)"
};

export type Messages = typeof en;

export function normalizeLocale(locale?: string | null): Locale | undefined {
  return locales.includes(locale as Locale) ? (locale as Locale) : undefined;
}

export function resolveLocale(locale?: string | null): Locale {
  return normalizeLocale(locale) ?? defaultLocale;
}

export function pickLocale({
  userLocale,
  cookieLocale,
  acceptLanguage
}: {
  userLocale?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const fromUser = normalizeLocale(userLocale);
  if (fromUser) return fromUser;

  const fromCookie = normalizeLocale(cookieLocale);
  if (fromCookie) return fromCookie;

  const fromHeader = matchAcceptLanguage(acceptLanguage);
  if (fromHeader) return fromHeader;

  return defaultLocale;
}

function matchAcceptLanguage(acceptLanguage?: string | null): Locale | undefined {
  if (!acceptLanguage) return undefined;

  const tags = acceptLanguage
    .split(",")
    .map(part => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const tag of tags) {
    if (tag === "en" || tag.startsWith("en-")) return "en";
    if (tag === "sr-cyrl" || tag === "sr-cy") return "sr-Cyrl";
    if (tag === "sr" || tag.startsWith("sr-")) return "sr-Latn";
  }

  return undefined;
}

export async function getMessages(locale: string = defaultLocale): Promise<Messages> {
  const resolved = resolveLocale(locale);

  switch (resolved) {
    case "sr-Latn":
      return (await import("@/messages/sr-Latn.json")).default;
    case "sr-Cyrl":
      return (await import("@/messages/sr-Cyrl.json")).default;
    default:
      return en;
  }
}
