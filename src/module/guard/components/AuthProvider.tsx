"use client";

import type { ReactNode } from "react";
import { useAuthInit } from "../hooks/useAuthInit";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Inicializar autenticación solo una vez
  useAuthInit();

  return <>{children}</>;
}
