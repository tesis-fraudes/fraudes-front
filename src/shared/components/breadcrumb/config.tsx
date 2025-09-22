import { Home, LogIn, Settings, BarChart3, CreditCard, Brain } from "lucide-react";
import type { RouteIcons, RouteLabels } from "./types";

// Mapeo de rutas a etiquetas en español
export const routeLabels: RouteLabels = {
  dashboard: "Dashboard",
  model: "Modelo de IA",
  transactions: "Transacciones",
  reports: "Reportes",
  auth: "Autenticación",
  singin: "Iniciar Sesión",
  profile: "Perfil",
  settings: "Configuración",
  neuroshield: "NeuroShield",
};

// Mapeo de rutas a iconos
export const routeIcons: RouteIcons = {
  dashboard: <Home className="h-4 w-4" />,
  model: <Brain className="h-4 w-4" />,
  transactions: <CreditCard className="h-4 w-4" />,
  reports: <BarChart3 className="h-4 w-4" />,
  auth: <LogIn className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

// Configuración de rutas especiales que requieren breadcrumbs personalizados
export const specialRoutes: Record<string, string[]> = {
  "/model": ["Modelo de IA"],
  "/transactions": ["Transacciones"],
  "/reports": ["Reportes"],
  "/auth/singin": ["Autenticación", "Iniciar Sesión"],
};
