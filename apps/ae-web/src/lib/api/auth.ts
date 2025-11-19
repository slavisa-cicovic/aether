import { LoginSchema } from "@/lib/validation/auth";

export interface LoginResponse {
  accessToken: string;
  user: { id: number; email: string; firstName?: string; lastName?: string };
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
    throw new Error(error?.message ?? "Unable to login");
  }

  return res.json();
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST"
  });
}
