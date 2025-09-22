import { useEffect, useState } from "react";
import type { HealthStatus } from "../services";
import { healthService } from "../services";

export function useHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const healthStatus = await healthService.checkHealth();
      setHealth(healthStatus);
    } catch (err: any) {
      setError(err.message || "Error al verificar el estado del sistema");
    } finally {
      setIsLoading(false);
    }
  };

  const isHealthy = async (): Promise<boolean> => {
    try {
      return await healthService.isHealthy();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    health,
    isLoading,
    error,
    checkHealth,
    isHealthy,
    isSystemHealthy: health?.status === "healthy",
  };
}
