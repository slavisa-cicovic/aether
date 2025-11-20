import { LoginSchema } from "@/lib/validation/auth";

export interface UserDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  lang?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserDto;
}

export async function loginRequest(
  payload: LoginSchema
): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? "LOGIN_ERROR");
  }

  return res.json();
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST"
  });
}
