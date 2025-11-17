// src/theme/typography.ts
import { scale } from "react-native-size-matters";
import { fonts } from "./fonts";

export const typography = {
  h1: { fontSize: scale(32), fontFamily: fonts.bold },
  h2: { fontSize: scale(24), fontFamily: fonts.semibold },
  h3: { fontSize: scale(20), fontFamily: fonts.semibold },

  body: { fontSize: scale(16), fontFamily: fonts.regular },
  bodyMedium: { fontSize: scale(16), fontFamily: fonts.medium },
  bodyBold: { fontSize: scale(16), fontFamily: fonts.semibold },

  caption: { fontSize: scale(12), fontFamily: fonts.regular },
} as const;

export type TypographyVariant = keyof typeof typography;
