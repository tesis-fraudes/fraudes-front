// Store y hooks

export { AuthProvider } from "./components/AuthProvider";
// Componentes
export { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
export { useAuth, usePermissions } from "./hooks/useAuth";
export { useAuthInit } from "./hooks/useAuthInit";
export { useRoleAccess } from "./hooks/useRoleAccess";
export type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "./schemas/auth.schema";
// Esquemas de validación
export {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./schemas/auth.schema";
// Tipos de servicios
export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenResponse,
} from "./services";
// Servicios
export { authService } from "./services";
export { useAuthStore } from "./store";
// Tipos
export type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from "./types";

// Sistema de roles y permisos
export {
  getAvailableRoles,
  getRoleConfig,
  getRolePermissions,
  Permission,
  ROLE_PERMISSIONS,
  roleHasPermission,
  USER_ROLES_CONFIG,
  UserRole,
} from "./types/roles";
