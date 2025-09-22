import { Brain } from "lucide-react";

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
    ],
  }
];
