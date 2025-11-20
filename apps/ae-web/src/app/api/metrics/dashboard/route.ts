import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getMessages, localeCookieName, pickLocale } from "@/i18n";

export async function GET() {
  const cookieStore = await cookies();
  const locale = pickLocale({
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    acceptLanguage: (await headers()).get("accept-language")
  });
  const messages = await getMessages(locale);

  return NextResponse.json({
    cards: [
      {
        title: messages.dashboard.cards.activeSessions.title,
        value: "148",
        delta: messages.dashboard.cards.activeSessions.delta
      },
      {
        title: messages.dashboard.cards.missionsToday.title,
        value: "34",
        delta: messages.dashboard.cards.missionsToday.delta
      },
      {
        title: messages.dashboard.cards.fleetAvailability.title,
        value: "96%",
        delta: messages.dashboard.cards.fleetAvailability.delta
      }
    ],
    status: messages.dashboard.status.normal
  });
}
