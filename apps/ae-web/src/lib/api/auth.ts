import { LoginSchema } from "@/lib/validation/auth";
import userAxiosInstance from "@/utils/userAxios";

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
  try {
    const res = await userAxiosInstance.post<LoginResponse>(
      "/api/auth/login",
      payload
    );
    return res.data;
  } catch (err: any) {
    const message =
      typeof err === "string"
        ? err
        : typeof err?.message === "string"
        ? err.message
        : "LOGIN_ERROR";
    throw new Error(message);
  }
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}
