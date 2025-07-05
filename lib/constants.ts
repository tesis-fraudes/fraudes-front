// Roles de usuario
export const USER_ROLES = {
  ANALISTA: "analista", 
  GERENTE: "gerente"
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Rutas de la aplicación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
  MODEL: "/model",
  SETTINGS: "/settings",
  UNAUTHORIZED: "/unauthorized"
} as const

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: "FraudGuard",
  DESCRIPTION: "Sistema de Detección y Gestión de Fraudes",
  VERSION: "2.1.3",
  COMPANY: "FraudGuard Inc."
} as const

// Estados de transacciones
export const TRANSACTION_STATUS = {
  PENDIENTE: "pendiente",
  APROBADA: "aprobada",
  RECHAZADA: "rechazada",
  EN_REVISION: "en_revision"
} as const

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS]

// Tipos de fraude
export const FRAUD_TYPES = {
  PHISHING: "phishing",
  IDENTITY_THEFT: "identity_theft",
  MONEY_LAUNDERING: "money_laundering",
  CREDIT_CARD_FRAUD: "credit_card_fraud",
  ACCOUNT_TAKEOVER: "account_takeover"
} as const

export type FraudType = typeof FRAUD_TYPES[keyof typeof FRAUD_TYPES]

// Niveles de riesgo
export const RISK_LEVELS = {
  BAJO: "bajo",
  MEDIO: "medio",
  ALTO: "alto",
  CRITICO: "critico"
} as const

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS]

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
} as const

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
} as const

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

// Configuración de fechas
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy HH:mm",
  API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  SHORT: "dd/MM/yyyy",
  TIME: "HH:mm"
} as const

// Configuración de API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
} as const

// Configuración de autenticación
export const AUTH_CONFIG = {
  TOKEN_KEY: "fraudguard_token",
  REFRESH_TOKEN_KEY: "fraudguard_refresh_token",
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60 * 1000 // 7 días
} as const

// Configuración de temas
export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system"
} as const

export type Theme = typeof THEME_CONFIG[keyof typeof THEME_CONFIG]

// Configuración de idiomas
export const LANGUAGES = {
  ES: "es",
  EN: "en"
} as const

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES]

// Configuración de monedas
export const CURRENCIES = {
  USD: "USD",
  EUR: "EUR",
  COP: "COP"
} as const

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES]

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  MAX_FILES: 5
} as const

// Configuración de validación
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Este campo es obligatorio",
  INVALID_EMAIL: "Email inválido",
  INVALID_PASSWORD: "La contraseña debe tener al menos 8 caracteres",
  NETWORK_ERROR: "Error de conexión. Inténtalo de nuevo.",
  UNAUTHORIZED: "No tienes permisos para realizar esta acción",
  NOT_FOUND: "Recurso no encontrado",
  SERVER_ERROR: "Error del servidor. Inténtalo más tarde."
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  SAVED: "Guardado exitosamente",
  DELETED: "Eliminado exitosamente",
  UPDATED: "Actualizado exitosamente",
  CREATED: "Creado exitosamente"
} as const 