import { create } from "zustand";

import { LoginCredentials } from "@src/api/types/auth";
import { User } from "@src/api/types/user";
import { authService } from "@src/services/authService";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
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
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Unable to log in at the moment.",
        loading: false,
      });
      throw error;
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
