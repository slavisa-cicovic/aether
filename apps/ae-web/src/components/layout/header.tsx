"use client";

import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" fontWeight="bold">
          AetherOps
        </Typography>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">
            {user?.email ?? "Operator"}
          </div>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </Avatar>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
