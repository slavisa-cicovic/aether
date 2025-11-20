import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/auth/session";
import { localeCookieName, pickLocale } from "@/i18n";

const USER_MGMT_BASE_URL =
  process.env.USER_MGMT_BASE_URL ?? "http://localhost:8082/api/auth/login";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const upstream = await fetch(USER_MGMT_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!upstream.ok) {
    const error = await upstream.json().catch(() => ({}));
    return NextResponse.json(
      { message: error?.message ?? "LOGIN_ERROR" },
      { status: upstream.status }
    );
  }

  const payload = await upstream.json();
  const token = payload.accessToken as string;
  const user = payload.user ?? null;

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions);

  const locale = pickLocale({
    userLocale: user?.lang,
    cookieLocale: cookieStore.get(localeCookieName)?.value
  });
  cookieStore.set(localeCookieName, locale, { path: "/" });

  return NextResponse.json(
    {
      accessToken: token,
      user
    },
    { status: 200 }
  );
}
