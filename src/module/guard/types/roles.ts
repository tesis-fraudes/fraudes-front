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

  // Transacciones
  TRANSACTIONS_VIEW = "transactions:view",
  TRANSACTIONS_MANUAL_REVIEW = "transactions:manual_review",

  // Simulación
  SIMULATION_VIEW = "simulation:view",
  SIMULATION_RUN = "simulation:run",

  // Reportes
  REPORTS_VIEW = "reports:view",
  REPORTS_PREDICTIONS = "reports:predictions",
  REPORTS_APPROVED = "reports:approved",
  REPORTS_REJECTED = "reports:rejected",
}

// Mapeo de roles a permisos
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ANALISTA]: [
    // Acceso al dashboard
    Permission.DASHBOARD_VIEW,
    // Acceso al mantenimiento de modelos
    Permission.MODEL_VIEW,
    Permission.MODEL_CREATE,
    Permission.MODEL_EDIT,
    Permission.MODEL_TRAIN,
    Permission.MODEL_CONFIGURE,
    // Puede gestionar transacciones manuales
    Permission.TRANSACTIONS_VIEW,
    Permission.TRANSACTIONS_MANUAL_REVIEW,
    // Tiene acceso al simulador
    Permission.SIMULATION_VIEW,
    Permission.SIMULATION_RUN,
  ],

  [UserRole.GERENTE]: [
    // Acceso al dashboard
    Permission.DASHBOARD_VIEW,
    // Solo acceso a reportes y paneles de resultados
    Permission.REPORTS_VIEW,
    Permission.REPORTS_PREDICTIONS,
    Permission.REPORTS_APPROVED,
    Permission.REPORTS_REJECTED,
  ],

  [UserRole.ADMIN]: [
    // Acceso total al sistema - puede visualizar, crear, editar y eliminar cualquier módulo
    ...Object.values(Permission),
  ],

  [UserRole.SUPER_ADMIN]: [
    // Super admin tiene todos los permisos
    ...Object.values(Permission),
  ],
};

// Configuración de roles para el frontend
export const USER_ROLES_CONFIG = {
  [UserRole.ANALISTA]: {
    label: "🔍 Analista",
    description: "Mantenimiento de modelos, gestión de transacciones manuales y simulador",
    color: "blue",
  },
  [UserRole.GERENTE]: {
    label: "👔 Gerencia",
    description: "Acceso a reportes y paneles de resultados (solo lectura)",
    color: "green",
  },
  [UserRole.ADMIN]: {
    label: "⚙️ Administrador",
    description: "Acceso total al sistema - puede visualizar, crear, editar y eliminar cualquier módulo",
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
