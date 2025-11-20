import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { localeCookieName, pickLocale } from "@/i18n";

const USER_MGMT_PROFILE_URL =
  process.env.USER_MGMT_PROFILE_URL ?? "http://localhost:8082/api/auth/me";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const upstream = await fetch(USER_MGMT_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!upstream.ok) {
    return NextResponse.json({ user: null }, { status: upstream.status });
  }

  const user = await upstream.json();
  const locale = pickLocale({
    userLocale: user?.lang,
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    acceptLanguage: (await headers()).get("accept-language")
  });

  const response = NextResponse.json({ user });
  response.cookies.set(localeCookieName, locale, { path: "/" });
  return response;
}
