"use client";
import { useContext } from "react";
import { AuthContext } from "../auth.provider";
import { AuthContextType } from "../vm/auth.vm";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
