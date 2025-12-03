import { useMemo } from "react";
import { usePermissions } from "@/module/guard";
import { menuData, type MenuItem, type SubMenuItem } from "../routes/menu.config";

export function useFilteredMenu() {
  const { hasPermission } = usePermissions();

  const filteredMenu = useMemo(() => {
    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => {
          // Si no tiene permiso requerido, filtrar el item
          if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
            return false;
          }

          // Si tiene hijos, filtrar también los hijos
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              const hasChildPermission = !child.requiredPermission || hasPermission(child.requiredPermission);
              return hasChildPermission;
            });

            // Si no quedan hijos válidos, filtrar el item padre también
            if (filteredChildren.length === 0) {
              return false;
            }

            // Actualizar los hijos filtrados
            item.children = filteredChildren;
          }

          return true;
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterSubMenuItems(item.children) : undefined,
        }));
    };

    const filterSubMenuItems = (items: SubMenuItem[]): SubMenuItem[] => {
      return items.filter((item) => {
        return !item.requiredPermission || hasPermission(item.requiredPermission);
      });
    };

    return menuData
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0); // Solo mostrar secciones que tengan items
  }, [hasPermission]);

  return filteredMenu;
}
