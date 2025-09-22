// Definición de roles del sistema
export enum UserRole {
  ANALISTA = "analista",
  GERENTE = "gerente",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// Definición de permisos del sistema
export enum Permission {
  // Dashboard
  DASHBOARD_VIEW = "dashboard:view",

  // Configuración del sistema
  SETTINGS_VIEW = "settings:view",
  SETTINGS_EDIT = "settings:edit",

  // Modelos de IA
  MODEL_VIEW = "model:view",
  MODEL_CREATE = "model:create",
  MODEL_EDIT = "model:edit",
  MODEL_DELETE = "model:delete",
  MODEL_ACTIVATE = "model:activate",
  MODEL_TRAIN = "model:train",
  MODEL_CONFIGURE = "model:configure",

  // Administración
  ADMIN_VIEW = "admin:view",
  ADMIN_MANAGE_ROLES = "admin:manage_roles",
  ADMIN_MANAGE_PERMISSIONS = "admin:manage_permissions",
}

// Mapeo de roles a permisos
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ANALISTA]: [
    Permission.DASHBOARD_VIEW,
    Permission.MODEL_VIEW,
  ],

  [UserRole.GERENTE]: [
    Permission.DASHBOARD_VIEW,
    Permission.MODEL_VIEW,
    Permission.MODEL_CREATE,
    Permission.MODEL_ACTIVATE,
    Permission.MODEL_TRAIN,
    Permission.SETTINGS_VIEW,
  ],

  [UserRole.ADMIN]: [
    Permission.DASHBOARD_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    Permission.MODEL_VIEW,
    Permission.MODEL_CREATE,
    Permission.MODEL_EDIT,
    Permission.MODEL_DELETE,
    Permission.MODEL_ACTIVATE,
    Permission.MODEL_TRAIN,
    Permission.MODEL_CONFIGURE,
    Permission.ADMIN_VIEW,
  ],

  [UserRole.SUPER_ADMIN]: [
    // Super admin tiene todos los permisos
    ...Object.values(Permission),
  ],
};

// Configuración de roles para el frontend
export const USER_ROLES_CONFIG = {
  [UserRole.ANALISTA]: {
    label: "🔍 Analista de Fraude",
    description: "Puede ver y analizar datos del sistema",
    color: "blue",
  },
  [UserRole.GERENTE]: {
    label: "👔 Gerente/Supervisor",
    description: "Puede gestionar modelos de IA y configuraciones del sistema",
    color: "green",
  },
  [UserRole.ADMIN]: {
    label: "⚙️ Administrador",
    description: "Acceso completo al sistema y configuración",
    color: "purple",
  },
  [UserRole.SUPER_ADMIN]: {
    label: "👑 Super Administrador",
    description: "Control total del sistema",
    color: "red",
  },
};

// Helper para obtener permisos de un rol
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Helper para verificar si un rol tiene un permiso
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return getRolePermissions(role).includes(permission);
}

// Helper para obtener todos los roles disponibles
export function getAvailableRoles(): UserRole[] {
  return Object.values(UserRole);
}

// Helper para obtener configuración de un rol
export function getRoleConfig(role: UserRole) {
  return USER_ROLES_CONFIG[role];
}
