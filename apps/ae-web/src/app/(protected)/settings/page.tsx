"use client";

import { Typography, Card, CardContent, Button, Stack } from "@mui/material";
import { useThemeMode } from "@/providers/theme-provider";

export default function SettingsPage() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight="bold">
        Settings
      </Typography>
      <Card>
        <CardContent className="space-y-4">
          <Typography variant="h6">Appearance</Typography>
          <Typography variant="body2" color="text.secondary">
            Current mode: {mode}
          </Typography>
          <Button variant="outlined" onClick={toggleMode}>
            Toggle Theme
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
