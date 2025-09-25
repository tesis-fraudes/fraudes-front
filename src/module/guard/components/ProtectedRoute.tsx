"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Permission, UserRole } from "../types/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
  redirectTo = "/auth/singin",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Solo redirigir si no está cargando y no está autenticado
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
      // Usar replace en lugar de push para evitar problemas en SPA
      // En producción, asegurar que CloudFront esté configurado para SPA
      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Mostrar loading mientras se redirige
  if (shouldRedirect) {
    return <>{fallback}</>;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Verificar roles requeridos
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  // Verificar permisos requeridos
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
            <p className="text-gray-600">
              No tienes los permisos necesarios para acceder a esta página.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Componente para rutas públicas (solo accesibles cuando NO estás autenticado)
export function PublicRoute({
  children,
  redirectTo = "/model",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Solo redirigir si no está cargando y está autenticado
    if (!isLoading && isAuthenticated) {
      setShouldRedirect(true);
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
