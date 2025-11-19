import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, expiredCookieOptions } from "@/lib/auth/session";

export async function POST() {
  cookies().set(AUTH_COOKIE_NAME, "", expiredCookieOptions);
  return NextResponse.json({ success: true });
}
