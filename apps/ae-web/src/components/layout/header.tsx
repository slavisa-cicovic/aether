"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AccountPopover } from "@/components/account-popover";

export function Header() {
  const t = useTranslations("common");

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" fontWeight="bold">
          {t("brand")}
        </Typography>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AccountPopover />
        </div>
      </Toolbar>
    </AppBar>
  );
}
