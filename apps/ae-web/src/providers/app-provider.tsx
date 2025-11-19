"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SWRConfig } from "swr";
import { axiosClient } from "@/lib/api/client";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SWRConfig
          value={{
            fetcher: url => axiosClient.get(url).then(res => res.data),
            revalidateOnFocus: true
          }}
        >
          {children}
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
