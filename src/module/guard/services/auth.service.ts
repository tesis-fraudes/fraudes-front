import { type ApiResponse, apiService } from "@/shared/services/api.service";
import { ROLE_PERMISSIONS, UserRole } from "../types/roles";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenResponse,
} from "./types";

class AuthService {
  private isMock = true; // Siempre usar mock para SPA estática

  // Simulación de API - reemplazar con llamadas reales
  private mockApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Usuarios de prueba con diferentes roles
      const testUsers = [
        {
          email: "admin@apuestatotal.com",
          password: "admin123",
          user: {
            id: "1",
            email: "admin@apuestatotal.com",
            name: "Leonardo Admin",
            role: UserRole.ADMIN,
            permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
          },
        },
        {
          email: "gerente@apuestatotal.com",
          password: "gerente123",
          user: {
            id: "2",
            email: "gerente@apuestatotal.com",
            name: "María Gerente",
            role: UserRole.GERENTE,
            permissions: ROLE_PERMISSIONS[UserRole.GERENTE],
          },
        },
        {
          email: "analista@apuestatotal.com",
          password: "analista123",
          user: {
            id: "3",
            email: "analista@apuestatotal.com",
            name: "Carlos Analista",
            role: UserRole.ANALISTA,
            permissions: ROLE_PERMISSIONS[UserRole.ANALISTA],
          },
        },
      ];

      const user = testUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        return {
          user: user.user,
          token: `mock-jwt-token-${Date.now()}`,
        };
      }

      throw new Error("Credenciales inválidas");
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data.password !== data.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const role = data.role || UserRole.ANALISTA;

      return {
        user: {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          role: role,
          permissions: ROLE_PERMISSIONS[role],
        },
        token: `mock-jwt-token-${Date.now()}`,
      };
    },

    verifyToken: async (token: string): Promise<VerifyTokenResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simular verificación de token
      if (token.startsWith("mock-jwt-token-")) {
        return {
          user: {
            id: "1",
            email: "admin@apuestatotal.com",
            name: "Leonardo Admin",
            role: UserRole.ADMIN,
            permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
          },
        };
      }

      throw new Error("Token inválido");
    },
  };

  // Métodos reales de API usando axios
  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      switch (method) {
        case "GET":
          return await apiService.get<T>(endpoint);
        case "POST":
          return await apiService.post<T>(endpoint, data);
        case "PUT":
          return await apiService.put<T>(endpoint, data);
        case "DELETE":
          return await apiService.delete<T>(endpoint);
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }
    } catch (error: any) {
      throw new Error(error.message || "Error en la solicitud");
    }
  }

  // Métodos públicos
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (this.isMock) {
      return this.mockApi.login(credentials);
    }

    const response = await this.makeRequest<LoginResponse>("/auth/login", "POST", credentials);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    if (this.isMock) {
      return this.mockApi.register(data);
    }

    const response = await this.makeRequest<RegisterResponse>("/auth/register", "POST", data);
    return response.data;
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    if (this.isMock) {
      return this.mockApi.verifyToken(token);
    }

    const response = await this.makeRequest<VerifyTokenResponse>("/auth/verify", "POST", { token });
    return response.data;
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    if (this.isMock) {
      // Simular refresh token
      return { token: `mock-refresh-token-${Date.now()}` };
    }

    const response = await this.makeRequest<{ token: string }>("/auth/refresh", "POST", { token });
    return response.data;
  }

  async logout(token: string): Promise<void> {
    if (this.isMock) {
      // Simular logout
      return Promise.resolve();
    }

    await this.makeRequest<void>("/auth/logout", "POST", { token });
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
