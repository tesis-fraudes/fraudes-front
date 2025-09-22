# 🐳 Dockerfile para Next.js Standalone
# Multi-stage build para optimizar el tamaño de la imagen

# ===========================================
# Stage 1: Build - Construir la aplicación
# ===========================================
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Establecer directorio de trabajo
WORKDIR /app

# Copiar configuración de pnpm
COPY .npmrc ./

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias con pnpm
RUN pnpm install --frozen-lockfile --prod=false

# Copiar código fuente
COPY . .

# Build de la aplicación Next.js
RUN pnpm build

# ===========================================
# Stage 2: Production - Ejecutar aplicación
# ===========================================
FROM node:20-alpine AS production

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar archivos de build desde el stage anterior
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3002/ || exit 1

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
