"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { LoginSchema } from "@/lib/validation/auth";
import { loginRequest, logoutRequest, UserDto } from "@/lib/api/auth";
import { axiosClient, setAuthToken } from "@/lib/api/client";
import { setUserAuthToken } from "@/utils/userAxios";

interface AuthContextValue {
  user: UserDto | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserLocale: (lang: string) => void;
}

const TOKEN_STORAGE_KEY = "ae-auth-token";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      setToken(stored);
      setAuthToken(stored);
      setUserAuthToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!token || user) return;

    (async () => {
      const res = await axiosClient.get("/auth/profile");
      setUser(res.data.user);
    })();
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
    const payload: LoginSchema = { email, password };
    const response = await loginRequest(payload);
    setUser(response.user);
    setToken(response.accessToken);
    setAuthToken(response.accessToken);
    setUserAuthToken(response.accessToken);
    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setToken(null);
    setAuthToken(null);
    setUserAuthToken(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = "/login";
  }, []);

  const setUserLocale = useCallback((lang: string) => {
    setUser(prev => (prev ? { ...prev, lang } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setUserLocale
    }),
    [user, token, login, logout, setUserLocale]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
