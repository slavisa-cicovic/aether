"use client";

import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useThemeMode } from "@/providers/theme-provider";

export default function SettingsView() {
  const { mode, toggleMode } = useThemeMode();
  const t = useTranslations("settings");
  const modeLabel = t(`mode.${mode}`);

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight="bold">
        {t("title")}
      </Typography>
      <Card>
        <CardContent className="space-y-4">
          <Typography variant="h6">{t("appearance")}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("currentMode", { mode: modeLabel })}
          </Typography>
          <Button variant="outlined" onClick={toggleMode}>
            {t("toggleTheme")}
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
