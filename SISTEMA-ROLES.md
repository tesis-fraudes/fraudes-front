# Sistema de Roles y Permisos

Este documento explica cómo usar el sistema de roles y permisos implementado en la aplicación.

## Roles Disponibles

### 1. Analista (ANALISTA)
- **Descripción**: Puede ver y analizar datos del sistema
- **Permisos**: Solo lectura de usuarios, promociones, premios, CMS y reportes

### 2. Gerente (GERENTE)
- **Descripción**: Puede gestionar promociones, premios y usuarios
- **Permisos**: Lectura y escritura de promociones, premios y usuarios; edición de CMS

### 3. Administrador (ADMIN)
- **Descripción**: Acceso completo al sistema y configuración
- **Permisos**: Todos los permisos excepto gestión de roles y permisos

### 4. Super Administrador (SUPER_ADMIN)
- **Descripción**: Control total del sistema
- **Permisos**: Todos los permisos incluyendo gestión de roles y permisos

## Usuarios de Prueba

Para probar el sistema, puedes usar estas credenciales:

### Administrador
- **Email**: admin@apuestatotal.com
- **Contraseña**: admin123
- **Rol**: ADMIN

### Gerente
- **Email**: gerente@apuestatotal.com
- **Contraseña**: gerente123
- **Rol**: GERENTE

### Analista
- **Email**: analista@apuestatotal.com
- **Contraseña**: analista123
- **Rol**: ANALISTA

## Cómo Usar el Sistema

### 1. Proteger Rutas con Roles

```tsx
import { ProtectedRoute, UserRole, Permission } from "@/module/guard";

export default function AdminPage() {
  return (
    <ProtectedRoute 
      requiredRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.ADMIN_VIEW]}
    >
      <div>Contenido solo para administradores</div>
    </ProtectedRoute>
  );
}
```

### 2. Usar Permisos en Componentes

```tsx
import { usePermissions, Permission } from "@/module/guard";

function MyComponent() {
  const { hasPermission, user } = usePermissions();

  return (
    <div>
      {hasPermission(Permission.USERS_CREATE) && (
        <button>Crear Usuario</button>
      )}
      
      {hasPermission(Permission.USERS_DELETE) && (
        <button>Eliminar Usuario</button>
      )}
    </div>
  );
}
```

### 3. Usar el Hook Personalizado

```tsx
import { useRoleAccess } from "@/module/guard";

function Dashboard() {
  const { canAccess, isRole } = useRoleAccess();

  return (
    <div>
      {canAccess.users.view && <UsersSection />}
      {canAccess.promotions.create && <CreatePromotionButton />}
      {isRole.admin && <AdminPanel />}
    </div>
  );
}
```

### 4. Verificar Roles Específicos

```tsx
import { usePermissions, UserRole } from "@/module/guard";

function Navigation() {
  const { hasRole, hasAnyRole } = usePermissions();

  return (
    <nav>
      {hasRole(UserRole.ADMIN) && <AdminLink />}
      {hasAnyRole([UserRole.GERENTE, UserRole.ADMIN]) && <ManagerLink />}
    </nav>
  );
}
```

## Permisos Disponibles

### Dashboard
- `DASHBOARD_VIEW`: Ver el dashboard principal

### Usuarios
- `USERS_VIEW`: Ver lista de usuarios
- `USERS_CREATE`: Crear nuevos usuarios
- `USERS_EDIT`: Editar usuarios existentes
- `USERS_DELETE`: Eliminar usuarios

### Promociones
- `PROMOTIONS_VIEW`: Ver promociones
- `PROMOTIONS_CREATE`: Crear promociones
- `PROMOTIONS_EDIT`: Editar promociones
- `PROMOTIONS_DELETE`: Eliminar promociones
- `PROMOTIONS_ACTIVATE`: Activar promociones
- `PROMOTIONS_DEACTIVATE`: Desactivar promociones

### Premios
- `PRIZES_VIEW`: Ver premios
- `PRIZES_CREATE`: Crear premios
- `PRIZES_EDIT`: Editar premios
- `PRIZES_DELETE`: Eliminar premios
- `PRIZES_ASSIGN`: Asignar premios

### CMS
- `CMS_VIEW`: Ver contenido CMS
- `CMS_EDIT`: Editar contenido CMS
- `CMS_PUBLISH`: Publicar contenido CMS

### Reportes
- `REPORTS_VIEW`: Ver reportes
- `REPORTS_EXPORT`: Exportar reportes

### Configuración
- `SETTINGS_VIEW`: Ver configuración
- `SETTINGS_EDIT`: Editar configuración

### Administración
- `ADMIN_VIEW`: Ver panel de administración
- `ADMIN_MANAGE_ROLES`: Gestionar roles
- `ADMIN_MANAGE_PERMISSIONS`: Gestionar permisos

## Mejores Prácticas

1. **Siempre verifica permisos en el frontend**: Aunque el backend debe validar, el frontend debe mostrar/ocultar contenido según permisos.

2. **Usa ProtectedRoute para rutas**: Protege rutas completas con `ProtectedRoute`.

3. **Usa hooks para lógica condicional**: Usa `usePermissions` o `useRoleAccess` para mostrar/ocultar elementos.

4. **Sé específico con permisos**: En lugar de verificar roles, verifica permisos específicos cuando sea posible.

5. **Documenta nuevos permisos**: Cuando agregues nuevos permisos, actualiza esta documentación.

## Extensión del Sistema

Para agregar nuevos roles o permisos:

1. Edita `src/module/guard/types/roles.ts`
2. Agrega el nuevo rol o permiso
3. Actualiza `ROLE_PERMISSIONS` para mapear el rol a sus permisos
4. Actualiza `USER_ROLES_CONFIG` para la configuración del frontend
5. Actualiza esta documentación

## Ejemplo de Uso Completo

```tsx
import { 
  ProtectedRoute, 
  useRoleAccess, 
  UserRole, 
  Permission 
} from "@/module/guard";

function UsersPage() {
  const { canAccess, userInfo } = useRoleAccess();

  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.USERS_VIEW]}
    >
      <div>
        <h1>Gestión de Usuarios</h1>
        <p>Bienvenido, {userInfo.name} ({userInfo.role})</p>
        
        {canAccess.users.create && (
          <button>Crear Nuevo Usuario</button>
        )}
        
        {canAccess.users.delete && (
          <button>Eliminar Usuario</button>
        )}
      </div>
    </ProtectedRoute>
  );
}
```
