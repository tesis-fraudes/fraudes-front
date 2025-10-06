import { useMemo } from "react";
import { usePermissions } from "@/module/guard";
import { menuData, type MenuItem, type SubMenuItem } from "../routes/menu.config";

export function useFilteredMenu() {
  const { hasPermission, user, role } = usePermissions();

  const filteredMenu = useMemo(() => {
    console.log("🔍 Filtrando menú para usuario:", user?.name, "rol:", role);
    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => {
          // Si no tiene permiso requerido, filtrar el item
          if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
            console.log("❌ Filtrando item:", item.label, "permiso requerido:", item.requiredPermission);
            return false;
          }

          console.log("✅ Mostrando item:", item.label, "permiso:", item.requiredPermission);

          // Si tiene hijos, filtrar también los hijos
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              const hasChildPermission = !child.requiredPermission || hasPermission(child.requiredPermission);
              if (!hasChildPermission) {
                console.log("❌ Filtrando subitem:", child.label, "permiso requerido:", child.requiredPermission);
              } else {
                console.log("✅ Mostrando subitem:", child.label, "permiso:", child.requiredPermission);
              }
              return hasChildPermission;
            });

            // Si no quedan hijos válidos, filtrar el item padre también
            if (filteredChildren.length === 0) {
              console.log("❌ Filtrando item padre (sin hijos válidos):", item.label);
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
