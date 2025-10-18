# 🛡️ Sistema de Detección de Fraudes

Sistema de gestión y análisis de transacciones fraudulentas desarrollado con Next.js, TypeScript y Tailwind CSS. Incluye un modelo de IA para predicción de fraudes, revisión manual de transacciones sospechosas y generación de reportes.

## 🚀 Características Principales

- **Modelo de IA**: Sistema de predicción de fraudes con machine learning
- **Revisión Manual**: Interfaz para analistas revisar transacciones sospechosas
- **Reportes Avanzados**: Generación de reportes de predicciones, transacciones aprobadas y rechazadas
- **Simulación**: Herramienta de simulación de compras para testing
- **Sistema de Roles**: Control de acceso basado en roles y permisos
- **Dashboard Intuitivo**: Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Estado**: Zustand
- **Tablas**: TanStack Table
- **Formularios**: React Hook Form + Zod
- **Editor**: Monaco Editor
- **Gráficos**: Recharts
- **Linting**: Biome
- **Containerización**: Docker + Nginx

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Páginas de Next.js (App Router)
│   ├── (extranet)/              # Rutas públicas
│   │   └── auth/                # Autenticación
│   ├── (intranet)/              # Rutas privadas
│   │   ├── model/               # Modelo de IA
│   │   ├── reports/             # Reportes
│   │   ├── simulation/          # Simulación
│   │   └── transactions/        # Transacciones
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── module/                      # Módulos de la aplicación
│   ├── approval/                # Módulo de aprobación
│   │   └── services/            # Servicios de aprobación
│   ├── auth/                    # Módulo de autenticación
│   │   ├── components/          # Componentes de auth
│   │   └── hooks/               # Hooks de auth
│   ├── guard/                   # Sistema de roles y permisos
│   │   ├── components/          # Componentes de protección
│   │   ├── hooks/               # Hooks de permisos
│   │   ├── schemas/             # Esquemas de validación
│   │   ├── services/            # Servicios de auth
│   │   ├── store/               # Store de autenticación
│   │   └── types/               # Tipos de roles y permisos
│   ├── model/                   # Módulo del modelo de IA
│   │   ├── adapters/            # Adaptadores de datos
│   │   ├── components/          # Componentes del modelo
│   │   ├── services/            # Servicios del modelo
│   │   └── store/               # Store del modelo
│   ├── reports/                 # Módulo de reportes
│   │   ├── components/          # Componentes de reportes
│   │   └── services/            # Servicios de reportes
│   ├── simulation/              # Módulo de simulación
│   │   ├── components/          # Componentes de simulación
│   │   ├── services/            # Servicios de simulación
│   │   └── store/               # Store de simulación
│   └── transactions/            # Módulo de transacciones
│       ├── components/          # Componentes de transacciones
│       ├── data/                # Datos de prueba
│       ├── hooks/               # Hooks de transacciones
│       └── services/            # Servicios de transacciones
├── shared/                      # Componentes y utilidades compartidas
│   ├── components/              # Componentes UI compartidos
│   │   ├── breadcrumb/          # Componente de breadcrumb
│   │   ├── layouts/             # Layouts compartidos
│   │   ├── modals/              # Modales
│   │   ├── sidebar/             # Sidebar
│   │   ├── table-pagination.tsx # Paginación de tablas
│   │   ├── theme/               # Tema y estilos
│   │   ├── topnav/              # Navegación superior
│   │   └── user-profile/        # Perfil de usuario
│   ├── const/                   # Constantes
│   ├── hooks/                   # Hooks compartidos
│   ├── lib/                     # Utilidades
│   ├── routes/                  # Configuración de rutas
│   ├── services/                # Servicios compartidos
│   ├── store/                   # Store global
│   ├── style/                   # Estilos globales
│   └── ui/                      # Componentes base (shadcn/ui)
└── types/                       # Tipos globales
```

## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js 18+
- pnpm

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd fraudes-front

# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Abrir en http://localhost:3000
```

### Scripts Disponibles
```bash
pnpm dev              # Desarrollo (http://localhost:3000)
pnpm build            # Build de la aplicación
pnpm build:spa        # Build como SPA
pnpm build:static     # Build estático
pnpm start            # Servidor de producción
pnpm lint             # Linter
pnpm lint:fix         # Linter con corrección automática
pnpm format           # Formatear código
pnpm format:check     # Verificar formato
pnpm fix              # Lint + Format
pnpm export           # Exportar aplicación
pnpm serve            # Servir archivos estáticos
```

## 🐳 Docker

### Desarrollo Local
```bash
# Build de la imagen
pnpm docker:build

# Ejecutar contenedor
pnpm docker:run

# O usar docker-compose
pnpm docker:compose
```

### Scripts Docker
```bash
pnpm docker:build     # Build imagen Docker
pnpm docker:run       # Ejecutar contenedor
pnpm docker:compose   # Docker Compose
pnpm docker:clean     # Limpiar imágenes
```

## 🔐 Sistema de Roles y Permisos

### Roles Disponibles
- **ANALISTA**: Solo lectura de datos y reportes
- **GERENTE**: Gestión de transacciones y reportes
- **ADMIN**: Acceso completo excepto gestión de roles
- **SUPER_ADMIN**: Control total del sistema

### Usuarios de Prueba
- **Admin**: admin@apuestatotal.com / admin123
- **Gerente**: gerente@apuestatotal.com / gerente123
- **Analista**: analista@apuestatotal.com / analista123

### Uso del Sistema de Permisos
```tsx
import { ProtectedRoute, usePermissions, Permission } from "@/module/guard";

// Proteger rutas
<ProtectedRoute requiredPermissions={[Permission.TRANSACTIONS_VIEW]}>
  <TransactionsPage />
</ProtectedRoute>

// Verificar permisos en componentes
const { hasPermission } = usePermissions();
{hasPermission(Permission.TRANSACTIONS_CREATE) && <CreateButton />}
```

## 📊 Módulos Principales

### 1. Modelo de IA (`/model`)
- Configuración y entrenamiento del modelo
- Predicciones en tiempo real
- Métricas de rendimiento

### 2. Transacciones (`/transactions`)
- Revisión manual de transacciones sospechosas
- Aprobación/rechazo de transacciones
- Historial de decisiones

### 3. Reportes (`/reports`)
- **Predicciones**: Reportes de predicciones realizadas
- **Aprobadas**: Transacciones aprobadas por analistas
- **Rechazadas**: Transacciones rechazadas por analistas

### 4. Simulación (`/simulation`)
- Simulación de compras para testing
- Validación de reglas de negocio
- Pruebas del modelo de IA

## 🔧 Variables de Entorno

### Desarrollo Local
Crea un archivo `.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Next.js Configuration
PORT=3000
NODE_ENV=development
```

### Producción
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# Next.js Configuration
PORT=3000
NODE_ENV=production

# Authentication
JWT_SECRET=tu-jwt-secret-super-secreto
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://usuario:password@localhost:5432/fraudes_db
REDIS_URL=redis://localhost:6379
```

## 🚀 Despliegue

### Build Estático
```bash
# Generar build estático
pnpm build:static

# Los archivos se generan en la carpeta `out/`
# Servir con cualquier servidor web estático
```

### Docker
```bash
# Build de imagen
docker build -t fraudes-front .

# Ejecutar contenedor
docker run -p 3000:3000 fraudes-front
```

### Nginx
El proyecto incluye configuración de Nginx para servir la aplicación SPA:
```nginx
# Configuración incluida en nginx.conf
# Maneja rutas SPA y archivos estáticos
```

## 📋 Funcionalidades por Módulo

### Módulo de Transacciones
- ✅ Lista de transacciones sospechosas
- ✅ Filtros avanzados (fecha, monto, estado)
- ✅ Revisión detallada de transacciones
- ✅ Aprobación/rechazo con comentarios
- ✅ Historial de decisiones
- ✅ Exportación de datos

### Módulo de Reportes
- ✅ Dashboard de métricas
- ✅ Reportes de predicciones
- ✅ Análisis de transacciones aprobadas/rechazadas
- ✅ Gráficos interactivos
- ✅ Exportación a PDF/Excel

### Módulo de Simulación
- ✅ Formulario de simulación de compra
- ✅ Validación de reglas de negocio
- ✅ Integración con modelo de IA
- ✅ Resultados en tiempo real

### Módulo de Modelo de IA
- ✅ Configuración de parámetros
- ✅ Entrenamiento del modelo
- ✅ Métricas de rendimiento
- ✅ Predicciones en tiempo real

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests e2e
pnpm test:e2e
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ por el equipo de desarrollo**