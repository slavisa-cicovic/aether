"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export function AccountPopover() {
  const { user, logout } = useAuth();
  const t = useTranslations("common");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  const email = user?.email ?? t("operatorFallback");
  const avatarFallback = user?.email?.[0]?.toUpperCase() ?? t("operatorFallback")[0];

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={event => setAnchorEl(event.currentTarget)}
        aria-label={t("logout")}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
          {avatarFallback}
        </Avatar>
      </IconButton>
      <Popover
        id={open ? "account-popover" : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 240 } } }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>{avatarFallback}</Avatar>
            <Box>
              <Typography variant="subtitle2">
                {displayName || email}
              </Typography>
              {displayName && (
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            color="inherit"
            sx={{ justifyContent: "flex-start" }}
          >
            {t("logout")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
