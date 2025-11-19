"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/auth-provider";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthContext unavailable");
  }
  return ctx;
};
