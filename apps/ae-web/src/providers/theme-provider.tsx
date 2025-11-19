"use client";

import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider
} from "@mui/material";
import { createContext, useContext, useMemo, useState, useCallback } from "react";

type Mode = "light" | "dark";

interface ThemeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const toggleMode = useCallback(
    () => setMode(prev => (prev === "light" ? "dark" : "light")),
    []
  );

  const paletteMode = mode === "light" ? "light" : "dark";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
          primary: {
            main: "#2563eb"
          },
          background: {
            default: paletteMode === "light" ? "#f8fafc" : "#020617",
            paper: paletteMode === "light" ? "#ffffff" : "#0f172a"
          }
        },
        shape: {
          borderRadius: 16
        },
        typography: {
          fontFamily: "Inter, sans-serif"
        }
      }),
    [paletteMode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeContext unavailable");
  return ctx;
}
