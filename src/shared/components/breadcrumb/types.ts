export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface DynamicBreadcrumbProps {
  customItems?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export interface RouteConfig {
  label: string;
  icon?: React.ReactNode;
  href?: string;
}

export type RouteLabels = Record<string, string>;
export type RouteIcons = Record<string, React.ReactNode>;
