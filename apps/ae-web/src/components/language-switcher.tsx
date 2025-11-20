"use client";

import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Locale, localeCookieName, localeLabels, locales } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("common.language");
  const { user, setUserLocale } = useAuth();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const nextLocale = event.target.value as Locale;
    document.cookie = `${localeCookieName}=${nextLocale}; path=/`;
    if (user) {
      setUserLocale(nextLocale);
    }
    router.refresh();
  };

  return (
    <FormControl size="small" variant="outlined">
      <Select
        value={locale}
        onChange={handleChange}
        sx={{ minWidth: 160 }}
        aria-label={t("label")}
      >
        {locales.map(code => (
          <MenuItem key={code} value={code}>
            {localeLabels[code]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
