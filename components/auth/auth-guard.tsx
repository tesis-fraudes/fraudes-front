"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { LoadingSpinner } from "./loading-spinner";
import { AccessDenied } from "./access-denied";
import { ROUTES, type UserRole } from "@/lib/constants";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  redirectIfAuthenticated?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo = ROUTES.LOGIN,
  fallback,
  redirectIfAuthenticated,
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para evitar parpadeos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Si se especifica redirección para usuarios autenticados
    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectIfAuthenticated);
      return;
    }

    // Si no está autenticado y NO se especifica redirectIfAuthenticated, redirigir al login
    if (!isAuthenticated && !redirectIfAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole && isAuthenticated) {
      const userRole = user?.role;
      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole as UserRole)
        : userRole === requiredRole;

      if (!hasRequiredRole) {
        // Redirigir al dashboard o mostrar error
        router.push(ROUTES.MODEL);
        return;
      }
    }
  }, [
    isAuthenticated,
    user?.role,
    router,
    redirectTo,
    requiredRole,
    redirectIfAuthenticated,
  ]);

  // Mostrar loading mientras se hidrata el store o durante el delay inicial
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Si se especifica redirectIfAuthenticated y el usuario está autenticado, mostrar loading
  if (redirectIfAuthenticated && isAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  // Si no está autenticado y NO se especifica redirectIfAuthenticated, mostrar loading
  if (!isAuthenticated && !redirectIfAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, mostrar error
  if (requiredRole && isAuthenticated) {
    const userRole = user?.role;
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole as UserRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      return <AccessDenied />;
    }
  }

  // Si todo está bien, renderizar los children
  return <>{children}</>;
}
