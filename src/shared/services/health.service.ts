import { apiService } from "./api.service";

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version?: string;
  environment?: string;
  services?: {
    database?: "up" | "down";
    redis?: "up" | "down";
    external_apis?: "up" | "down";
  };
}

class HealthService {
  private readonly baseEndpoint = "/draw-manage/v1/health";

  // GET /draw-manage/v1/health - Verificar estado del sistema
  async checkHealth(): Promise<HealthStatus> {
    const response = await apiService.get<HealthStatus>(this.baseEndpoint);
    return response.data;
  }

  // Verificar si el sistema está funcionando correctamente
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === "healthy";
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Obtener información detallada del sistema
  async getSystemInfo(): Promise<HealthStatus> {
    return this.checkHealth();
  }
}

export const healthService = new HealthService();
