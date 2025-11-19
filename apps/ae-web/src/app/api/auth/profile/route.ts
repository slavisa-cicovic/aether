import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const USER_MGMT_PROFILE_URL =
  process.env.USER_MGMT_PROFILE_URL ?? "http://localhost:8082/api/auth/me";

export async function GET() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
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
  return NextResponse.json({ user });
}
