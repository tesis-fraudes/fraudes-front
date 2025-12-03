import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import type { Role } from "../services/types";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const rolesData = await authService.getRoles();
        setRoles(rolesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar roles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, isLoading, error };
}
