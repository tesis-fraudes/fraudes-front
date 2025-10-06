import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services";
import type { AuthState, LoginCredentials, RegisterData, User } from "../types";

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: true, // Iniciar como loading para verificar estado
      token: null,

      // Actions
      login: async (credentials) => {
        console.log("🔐 Store: Iniciando login...");
        set({ isLoading: true });
        try {
          console.log("📞 Store: Llamando a authService.login...");
          const { user, token } = await authService.login(credentials);
          console.log("✅ Store: Login exitoso, actualizando estado...");
          console.log("👤 Usuario:", user);
          console.log("🎫 Token:", token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log("🎉 Store: Estado actualizado correctamente");
        } catch (error) {
          console.error("❌ Store: Error en login:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authService.register(data);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const { token, isLoading, isAuthenticated } = get();

        console.log("isLoading", isLoading);
        console.log("isAuthenticated", isAuthenticated);
        console.log("token", token);
        // Si ya está autenticado, no verificar
        if (isAuthenticated) {
          set({ isLoading: false });
          return;
        }

        // Si no hay token, marcar como no autenticado
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        // Si ya está cargando, no hacer nada
        if (isLoading) {
          return;
        }

        set({ isLoading: true });
        try {
          const { user } = await authService.verifyToken(token);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (_error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
