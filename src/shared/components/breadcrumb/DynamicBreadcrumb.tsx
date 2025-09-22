"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { routeIcons, routeLabels, specialRoutes } from "./config";
import type { BreadcrumbItem as BreadcrumbItemType, DynamicBreadcrumbProps } from "./types";

export default function DynamicBreadcrumb({
  customItems,
  showHome = true,
  className = "hidden sm:flex",
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Si se proporcionan elementos personalizados, usarlos
  if (customItems) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {customItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href} className="flex items-center">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Generar breadcrumbs automáticamente basados en la ruta
  const generateBreadcrumbs = (): BreadcrumbItemType[] => {
    // Verificar si hay una configuración especial para esta ruta
    if (specialRoutes[pathname]) {
      const labels = specialRoutes[pathname];
      return labels.map((label, index) => {
        const isLast = index === labels.length - 1;
        const href = index === 0 ? "/model" : `/${labels.slice(1, index + 1).join("/")}`;

        return {
          label,
          href: isLast ? undefined : href,
          icon: index === 0 ? routeIcons.dashboard : routeIcons[pathname.split("/")[index + 1]],
        };
      });
    }

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItemType[] = [];

    // Agregar Home si está habilitado
    if (showHome) {
      breadcrumbs.push({
        label: "Modelo de IA",
        href: "/model",
        icon: routeIcons.dashboard,
      });
    }

    // Construir breadcrumbs basados en los segmentos de la ruta
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        icon: routeIcons[segment],
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href} className="flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
