"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Brain, AlertTriangle, BarChart3, Settings, LogOut, Users, Activity } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { ROUTES, USER_ROLES, UserRole } from "@/lib/constants"

const navigationItems = [
  {
    title: "Modelo IA",
    href: ROUTES.MODEL,
    icon: Brain,
    roles: [USER_ROLES.ANALISTA, USER_ROLES.GERENTE],
    description: "PK1 - Evaluación Automática",
  },
  {
    title: "Revisión Manual",
    href: ROUTES.TRANSACTIONS,
    icon: AlertTriangle,
    roles: [USER_ROLES.ANALISTA, USER_ROLES.GERENTE],
    description: "PK2 - Transacciones Sospechosas",
  },
  {
    title: "Reportes",
    href: ROUTES.REPORTS,
    icon: BarChart3,
    roles: [USER_ROLES.GERENTE],
    description: "PK3 - Análisis Gerencial",
  },
  {
    title: "Usuarios",
    href: "/users",
    icon: Users,
    roles: [USER_ROLES.GERENTE],
    description: "Gestión de Usuarios",
  },
  {
    title: "Actividad",
    href: "/activity",
    icon: Activity,
    roles: [USER_ROLES.ANALISTA, USER_ROLES.GERENTE],
    description: "Registro de Acciones",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  if (!user) return null

  const filteredNavigation = navigationItems.filter((item) => item.roles.includes(user.role))

  const handleLogout = () => {
    logout()
    window.location.href = ROUTES.LOGIN
  }

  const getRoleBadge = (role: UserRole) => {
    const config = {
      analista: { label: "Analista", variant: "secondary" as const },
      gerente: { label: "Gerente", variant: "destructive" as const },
    }
    return config[role]
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">NeuroShield</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navegación Principal</h2>
        </div>

        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  {item.description && <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>}
                </div>
                {isActive && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
            </Link>
          )
        })}

        <Separator className="my-4" />

        <Link href={ROUTES.SETTINGS}>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === ROUTES.SETTINGS
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </div>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge variant={getRoleBadge(user.role).variant} className="text-xs">
            {getRoleBadge(user.role).label}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
