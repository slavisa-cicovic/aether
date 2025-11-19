// src/theme/fonts.ts
export const fonts = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  small: "Inter-Small",
  semibold: "Inter-SemiBold",
  bold: "Inter-Bold",
} as const;

export type FontName = keyof typeof fonts;
