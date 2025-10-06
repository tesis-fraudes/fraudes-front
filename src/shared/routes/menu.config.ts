import { Brain, BarChart3, CreditCard } from "lucide-react";
import { Permission } from "@/module/guard/types/roles";

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
  requiredPermission?: Permission;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
  requiredPermission?: Permission;
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

export const menuData: MenuSection[] = [
  {
    id: "main",
    label: "Principal",
    items: [
      {
        id: "model",
        label: "Modelo de IA",
        href: "/model",
        icon: Brain,
        requiredPermission: Permission.MODEL_VIEW,
      },
      {
        id: "transactions",
        label: "Revisión Manual de transacciones sospechosas",
        href: "/transactions",
        icon: CreditCard,
        requiredPermission: Permission.TRANSACTIONS_MANUAL_REVIEW,
      },
      {
        id: "reports",
        label: "Reportes",
        icon: BarChart3,
        requiredPermission: Permission.REPORTS_VIEW,
        children: [
          {
            id: "reports-predictions",
            label: "Predicciones realizadas",
            href: "/reports/predictions",
            requiredPermission: Permission.REPORTS_PREDICTIONS,
          },
          {
            id: "reports-approved-transactions",
            label: "Transacciones aprobadas",
            href: "/reports/approved-transactions",
            requiredPermission: Permission.REPORTS_APPROVED,
          },
          {
            id: "reports-rejected-transactions",
            label: "Transacciones rechazadas",
            href: "/reports/rejected-transactions",
            requiredPermission: Permission.REPORTS_REJECTED,
          },
        ],
      },
    ],
  },
  {
    id: "simulation",
    label: "Simulación",
    items: [
      {
        id: "simulation-compra",
        label: "Simulación de compra",
        href: "/simulation/compra",
        icon: CreditCard,
        requiredPermission: Permission.SIMULATION_VIEW,
      },
    ],
  }
];
