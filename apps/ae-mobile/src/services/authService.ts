import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthResponse, LoginCredentials } from "@src/api/types/auth";
import { User } from "@src/api/types/user";
import { USER_MANAGEMENT_API_BASE_URL } from "@src/constants/config";
import userManagementClient from "@src/utils/userManagementClient";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const USER_KEY = "auth.user";

async function persistAuthData(data: AuthResponse): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, data.accessToken],
    [REFRESH_TOKEN_KEY, data.refreshToken],
    [USER_KEY, JSON.stringify(data.user)],
  ]);
}

async function clearAuthStorage(): Promise<void> {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
  ]);
}

const buildAuthUrl = (path: string) => `${USER_MANAGEMENT_API_BASE_URL}${path}`;

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await userManagementClient.post<T>(buildAuthUrl(path), body, {
    baseURL: undefined,
  });
  return response.data;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    const data = await request<AuthResponse>("/api/auth/login", credentials);
    await persistAuthData(data);
    return data;
  },

  async refresh(refreshToken?: string): Promise<AuthResponse> {
    const token = refreshToken || (await this.getRefreshToken());
    if (!token) {
      throw new Error("Missing refresh token");
    }

    const data = await request<AuthResponse>("/api/auth/refresh", {
      refreshToken: token,
    });

    await persistAuthData(data);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (refreshToken) {
      try {
        await request<void>("/api/auth/logout", { refreshToken });
      } catch (error) {
        console.warn("Failed to revoke refresh token", error);
      }
    }

    await clearAuthStorage();
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async getUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as User) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return Boolean(token);
  },
};
