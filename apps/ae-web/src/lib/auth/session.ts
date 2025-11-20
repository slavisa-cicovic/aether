import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "ae_auth";

const maxAge = 60 * 60 * 24 * 7;

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge
};

export const expiredCookieOptions = {
  ...authCookieOptions,
  maxAge: 0
};

export async function getServerAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
