# 🔧 Variables de Entorno

Este documento describe todas las variables de entorno necesarias para el proyecto.

## 📁 Archivos de Entorno

### `.env.local` (Desarrollo Local)
```bash
# 🔧 Variables de entorno para desarrollo local
# Este archivo es para desarrollo local y NO debe subirse a Git

# ===========================================
# API Configuration
# ===========================================
# URL base de la API backend (para CMS y otros servicios)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# URL base del servicio de Backoffice Draws
NEXT_PUBLIC_BACKOFFICE_DRAWS_URL=http://localhost:8080

# ===========================================
# Next.js Configuration
# ===========================================
# Puerto de desarrollo (opcional, ya configurado en package.json)
PORT=3001

# ===========================================
# Authentication (si se implementa JWT real)
# ===========================================
# JWT_SECRET=tu-jwt-secret-super-secreto
# JWT_EXPIRES_IN=24h

# ===========================================
# Database (si se conecta a una DB real)
# ===========================================
# DATABASE_URL=postgresql://usuario:password@localhost:5432/web_draw_manage
# REDIS_URL=redis://localhost:6379

# ===========================================
# External Services
# ===========================================
# AWS_S3_BUCKET=tu-bucket-s3
# AWS_ACCESS_KEY_ID=tu-access-key
# AWS_SECRET_ACCESS_KEY=tu-secret-key
# AWS_REGION=us-east-1

# ===========================================
# Development Tools
# ===========================================
# NODE_ENV=development
# DEBUG=true
```

### `.env.production` (Producción)
```bash
# 🚀 Variables de entorno para producción
# Este archivo se usa en el servidor de producción

# ===========================================
# API Configuration
# ===========================================
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# ===========================================
# Next.js Configuration
# ===========================================
PORT=3001
NODE_ENV=production

# ===========================================
# Authentication
# ===========================================
JWT_SECRET=tu-jwt-secret-super-secreto-de-produccion
JWT_EXPIRES_IN=24h

# ===========================================
# Database
# ===========================================
DATABASE_URL=postgresql://usuario:password@db-server:5432/web_draw_manage
REDIS_URL=redis://redis-server:6379

# ===========================================
# External Services
# ===========================================
AWS_S3_BUCKET=tu-bucket-s3-produccion
AWS_ACCESS_KEY_ID=tu-access-key-produccion
AWS_SECRET_ACCESS_KEY=tu-secret-key-produccion
AWS_REGION=us-east-1

# ===========================================
# Security
# ===========================================
# CORS_ORIGIN=https://tu-dominio.com
# RATE_LIMIT_MAX=100
# RATE_LIMIT_WINDOW=900000
```

## 📋 Variables Requeridas

### ✅ Obligatorias
- `NEXT_PUBLIC_API_URL` - URL base de la API backend

### 🔧 Opcionales (con valores por defecto)
- `PORT` - Puerto del servidor (default: 3001)
- `NODE_ENV` - Entorno de ejecución (default: development)

### 🔐 Seguridad (para producción)
- `JWT_SECRET` - Secreto para firmar JWT tokens
- `JWT_EXPIRES_IN` - Tiempo de expiración de tokens

### 🗄️ Base de Datos (para producción)
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `REDIS_URL` - URL de conexión a Redis

### ☁️ Servicios Externos (para producción)
- `AWS_S3_BUCKET` - Bucket de S3 para archivos
- `AWS_ACCESS_KEY_ID` - Access Key de AWS
- `AWS_SECRET_ACCESS_KEY` - Secret Key de AWS
- `AWS_REGION` - Región de AWS

## 🚀 Configuración por Entorno

### Desarrollo Local
1. Crear archivo `.env.local`
2. Copiar variables del ejemplo
3. Ajustar `NEXT_PUBLIC_API_URL` según tu API local

### Producción
1. Crear archivo `.env.production`
2. Configurar todas las variables de producción
3. Asegurar que las variables sensibles estén en el servidor

### Docker
Las variables se pasan via `docker-compose.yml` o `Dockerfile`:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

## 🔒 Seguridad

### ❌ NO subir a Git
- `.env.local`
- `.env.production`
- Cualquier archivo con credenciales reales

### ✅ SÍ subir a Git
- `.env.example` (archivo de ejemplo)
- `ENV-VARIABLES.md` (esta documentación)

## 📝 Uso en el Código

```typescript
// Variables públicas (accesibles en el cliente)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Variables privadas (solo en el servidor)
const jwtSecret = process.env.JWT_SECRET;
const dbUrl = process.env.DATABASE_URL;
```

## 🛠️ Comandos Útiles

```bash
# Verificar variables cargadas
node -e "console.log(process.env)"

# Ejecutar con variables específicas
NODE_ENV=production PORT=3001 pnpm start

# Cargar desde archivo específico
dotenv -e .env.production pnpm start
```
