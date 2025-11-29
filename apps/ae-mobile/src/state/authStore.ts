import { isAxiosError } from "axios";
import { create } from "zustand";

import { LoginCredentials, RegisterPayload } from "@src/api/types/auth";
import { User } from "@src/api/types/user";
import { authService } from "@src/services/authService";
import { saveBiometricCredentials } from "@src/utils/biometricStorage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  biometricCredentialVersion: number;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithRefreshToken: (refreshToken?: string | null) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  hydrated: false,
  biometricCredentialVersion: 0,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken, user] = await Promise.all([
        authService.getToken(),
        authService.getRefreshToken(),
        authService.getUser(),
      ]);

      set({
        accessToken,
        refreshToken,
        user,
        hydrated: true,
      });
    } catch (error) {
      console.warn("Failed to hydrate auth state", error);
      set({ hydrated: true });
    }
  },

  login: async credentials => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      await saveBiometricCredentials(credentials);
      set(state => ({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
        error: null,
        biometricCredentialVersion: state.biometricCredentialVersion + 1,
      }));
    } catch (error: unknown) {
      const message = deriveAuthErrorMessage(error);
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },

  register: async payload => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(payload);
      await saveBiometricCredentials({ email: payload.email, password: payload.password });
      set(state => ({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
        error: null,
        biometricCredentialVersion: state.biometricCredentialVersion + 1,
      }));
    } catch (error: unknown) {
      const message = deriveAuthErrorMessage(error);
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },

  loginWithRefreshToken: async refreshTokenArg => {
    set({ loading: true, error: null });
    try {
      const token = refreshTokenArg || (await authService.getRefreshToken());
      if (!token) {
        throw new Error("Missing refresh token.");
      }
      const response = await authService.refresh(token);
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = deriveAuthErrorMessage(error);
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  clearError: () => set({ error: null }),
}));

function deriveAuthErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    return (
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      (typeof data?.detail === "string" && data.detail) ||
      error.message ||
      "Authentication failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed.";
}
