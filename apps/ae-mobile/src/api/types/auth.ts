import { User } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  lang?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string; // Provided for dev/test flows where email is not wired
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
