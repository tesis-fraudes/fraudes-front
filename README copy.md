# Web BackOffice Promociones

Sistema de gestión de promociones desarrollado con Next.js, TypeScript y Tailwind CSS.

## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js 18+
- pnpm

### Instalación
```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Abrir en http://localhost:3002
```

### 🚀 Ejecutar en Producción
```bash
# 1. Hacer build de la aplicación
pnpm build

# 2. Ejecutar servidor de producción
pnpm start

# Abrir en http://localhost:3002
```

### Scripts Disponibles
```bash
pnpm dev          # Desarrollo (http://localhost:3002)
pnpm build        # Build aplicación (genera .next/)
pnpm start        # Servidor de producción (http://localhost:3002)
pnpm lint         # Linter
pnpm format       # Formatear código
pnpm fix          # Lint + Format
```

## 🐳 Docker

### Desarrollo Local
```bash
# Build de la imagen (incluye build de SPA)
pnpm docker:build

# Ejecutar contenedor (servidor Nginx)
pnpm docker:run

# O usar docker-compose
pnpm docker:compose
```

### Scripts Docker
```bash
pnpm docker:build    # Build imagen Docker
pnpm docker:run      # Ejecutar contenedor
pnpm docker:compose  # Docker Compose
pnpm docker:clean    # Limpiar imágenes
```

## 🚀 Despliegue en Producción

### GitLab CI/CD
El proyecto está configurado para desplegarse automáticamente mediante GitLab CI/CD:

1. **Push a `main`** → Despliegue automático
2. **Pipeline incluye:**
   - Build de la aplicación Next.js
   - Build de imagen Docker
   - Deploy a servidor de producción

### Configuración de Producción
- **Tipo:** Next.js Standalone
- **Servidor:** Node.js
- **Containerización:** Docker
- **Build:** `pnpm build` (genera carpeta `.next/`)

### Variables de Entorno

#### Desarrollo Local
Crea un archivo `.env.local` en la raíz del proyecto:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Next.js Configuration
PORT=3002
```

#### Producción
Configura las variables en tu servidor:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# Next.js Configuration
PORT=3002
NODE_ENV=production

# Authentication (opcional)
JWT_SECRET=tu-jwt-secret-super-secreto
JWT_EXPIRES_IN=24h

# Database (opcional)
DATABASE_URL=postgresql://usuario:password@localhost:5432/web_draw_manage
REDIS_URL=redis://localhost:6379

# AWS S3 (opcional)
AWS_S3_BUCKET=tu-bucket-s3
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
```

📋 **Ver documentación completa:** [ENV-VARIABLES.md](./ENV-VARIABLES.md)

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas de Next.js
├── module/             # Módulos de la aplicación
│   ├── auth/           # Autenticación
│   ├── dashboard/      # Dashboard
│   ├── guard/          # Guard de rutas
│   ├── prizes/         # Gestión de premios
│   ├── promotions/     # Gestión de promociones
│   └── users/          # Gestión de usuarios
└── shared/             # Componentes compartidos
    ├── components/     # Componentes UI
    ├── lib/           # Utilidades
    └── ui/            # Componentes base
```

## 🔧 Tecnologías

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Estado:** Zustand
- **Tablas:** TanStack Table
- **Formularios:** React Hook Form + Zod
- **Linting:** Biome
- **Containerización:** Docker + Nginx
