"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";

export const useAuthInit = () => {
  const { checkAuth } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      checkAuth();
    }
  }, [checkAuth]); // Solo se ejecuta una vez al montar

  return { hasInitialized: hasInitialized.current };
};
