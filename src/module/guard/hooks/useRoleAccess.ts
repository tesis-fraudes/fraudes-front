import { usePermissions } from "./useAuth";
import { UserRole, Permission } from "../types/roles";

/**
 * Hook personalizado para manejar el acceso basado en roles y permisos
 */
export function useRoleAccess() {
  const { hasPermission, hasRole, hasAnyRole, hasAnyPermission, user } = usePermissions();

  // Verificar si el usuario puede acceder a una funcionalidad específica
  const canAccess = {
    // Dashboard
    dashboard: hasPermission(Permission.DASHBOARD_VIEW),
    
    // Configuración
    settings: {
      view: hasPermission(Permission.SETTINGS_VIEW),
      edit: hasPermission(Permission.SETTINGS_EDIT),
      all: hasAnyPermission([
        Permission.SETTINGS_VIEW,
        Permission.SETTINGS_EDIT
      ])
    },
    
    // Modelos de IA
    model: {
      view: hasPermission(Permission.MODEL_VIEW),
      create: hasPermission(Permission.MODEL_CREATE),
      edit: hasPermission(Permission.MODEL_EDIT),
      delete: hasPermission(Permission.MODEL_DELETE),
      activate: hasPermission(Permission.MODEL_ACTIVATE),
      train: hasPermission(Permission.MODEL_TRAIN),
      configure: hasPermission(Permission.MODEL_CONFIGURE),
      all: hasAnyPermission([
        Permission.MODEL_VIEW,
        Permission.MODEL_CREATE,
        Permission.MODEL_EDIT,
        Permission.MODEL_DELETE,
        Permission.MODEL_ACTIVATE,
        Permission.MODEL_TRAIN,
        Permission.MODEL_CONFIGURE,
      ]),
    },

    // Administración
    admin: {
      view: hasPermission(Permission.ADMIN_VIEW),
      manageRoles: hasPermission(Permission.ADMIN_MANAGE_ROLES),
      managePermissions: hasPermission(Permission.ADMIN_MANAGE_PERMISSIONS),
      all: hasAnyPermission([
        Permission.ADMIN_VIEW,
        Permission.ADMIN_MANAGE_ROLES,
        Permission.ADMIN_MANAGE_PERMISSIONS,
      ]),
    },
  };

  // Verificar roles específicos
  const isRole = {
    analista: hasRole(UserRole.ANALISTA),
    gerente: hasRole(UserRole.GERENTE),
    admin: hasRole(UserRole.ADMIN),
    superAdmin: hasRole(UserRole.SUPER_ADMIN),
  };

  // Verificar si tiene alguno de los roles especificados
  const hasAnyOfRoles = (roles: UserRole[]) => hasAnyRole(roles);

  // Verificar si tiene alguno de los permisos especificados
  const hasAnyOfPermissions = (permissions: Permission[]) => hasAnyPermission(permissions);

  // Obtener información del usuario
  const userInfo = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    permissions: user?.permissions,
    isAuthenticated: !!user,
  };

  return {
    // Acceso granular por funcionalidad
    canAccess,
    
    // Verificación de roles
    isRole,
    hasAnyOfRoles,
    
    // Verificación de permisos
    hasPermission,
    hasAnyOfPermissions,
    
    // Información del usuario
    userInfo,
    
    // Métodos originales para casos específicos
    hasRole,
    hasAnyRole,
    hasAnyPermission
  };
}