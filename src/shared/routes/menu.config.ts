import { Brain, BarChart3, CreditCard } from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
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
      },
      {
        id: "transactions",
        label: "Transacciones",
        href: "/transactions",
        icon: CreditCard,
      },
      {
        id: "reports",
        label: "Reportes",
        href: "/reports",
        icon: BarChart3,
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
      },
    ],
  }
];
