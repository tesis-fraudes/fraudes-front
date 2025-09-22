import { Gift, Home, LogIn, Megaphone, Settings, Users } from "lucide-react";
import type { RouteIcons, RouteLabels } from "./types";

// Mapeo de rutas a etiquetas en español
export const routeLabels: RouteLabels = {
  dashboard: "Dashboard",
  promotions: "Promociones", // Mantener para compatibilidad
  prizes: "Premios",
  users: "Usuarios",
  auth: "Autenticación",
  singin: "Iniciar Sesión",
  profile: "Perfil",
  settings: "Configuración",
  neuroshield: "NeuroShield",
};

// Mapeo de rutas a iconos
export const routeIcons: RouteIcons = {
  dashboard: <Home className="h-4 w-4" />,
  promotions: <Megaphone className="h-4 w-4" />,
  prizes: <Gift className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  auth: <LogIn className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

// Configuración de rutas especiales que requieren breadcrumbs personalizados
export const specialRoutes: Record<string, string[]> = {
  "/model": ["Modelo de IA"],
  "/auth/singin": ["Autenticación", "Iniciar Sesión"],
};
