"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { LoginSchema } from "@/lib/validation/auth";
import { loginRequest, logoutRequest } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/client";

interface AuthContextValue {
  user: { id: number; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    }
  }, []);

  useEffect(() => {
    if (!token || user) return;

    (async () => {
      const res = await fetch("/api/auth/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    })();
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
    const payload: LoginSchema = { email, password };
    const response = await loginRequest(payload);
    setUser(response.user);
    setToken(response.accessToken);
    setAuthToken(response.accessToken);
    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setToken(null);
    setAuthToken(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
