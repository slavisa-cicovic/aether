// src/theme/useTheme.ts

import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  return {
    colors,
    spacing,
    typography,
    isDark: scheme === "dark",
  };
}
