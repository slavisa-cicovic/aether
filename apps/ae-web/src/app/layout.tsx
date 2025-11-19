import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/i18n";
import { AppProvider } from "@/providers/app-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Aether Web",
  description: "Aether control center"
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
