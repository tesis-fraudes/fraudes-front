import { useAuthStore } from "../store";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, token, login, register, logout, checkAuth } =
    useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    checkAuth,
  };
};

import type { Permission, UserRole } from "../types/roles";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) => user.permissions.includes(permission));
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    permissions: user?.permissions ?? [],
    role: user?.role ?? null,
    user,
  };
};
