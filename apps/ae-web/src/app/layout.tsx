import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { cookies, headers } from "next/headers";
import { getMessages, localeCookieName, pickLocale } from "@/i18n";
import { AppProvider } from "@/providers/app-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Aether Web",
  description: "Aether control center"
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = pickLocale({
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    acceptLanguage: headerList.get("accept-language")
  });
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
