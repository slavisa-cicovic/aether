"use client";

import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  const { user, logout } = useAuth();
  const t = useTranslations("common");
  const avatarFallback = user?.email?.[0]?.toUpperCase() ?? t("operatorFallback")[0];

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" fontWeight="bold">
          {t("brand")}
        </Typography>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="text-sm text-slate-500">
            {user?.email ?? t("operatorFallback")}
          </div>
          <Avatar sx={{ bgcolor: "primary.main" }}>{avatarFallback}</Avatar>
          <IconButton color="inherit" onClick={logout} aria-label={t("logout")}>
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
