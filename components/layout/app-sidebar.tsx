"use client"

import * as React from "react"
import {
  BarChart3,
  Brain,
  FileText,
  Home,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react"

import { useAuthStore } from "@/lib/auth-store"
import { ROUTES, USER_ROLES, type UserRole } from "@/lib/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  // Datos del equipo (simulado)
  const teams = [
    {
      name: "FraudGuard",
      logo: Shield,
      plan: "Enterprise",
    },
  ]

  // Navegación principal
  const navMain = [
    {
      title: "Transacciones",
      url: ROUTES.TRANSACTIONS,
      icon: BarChart3,
    },
    {
      title: "Modelo IA",
      url: ROUTES.MODEL,
      icon: Brain,
    },
    {
      title: "Reportes",
      url: ROUTES.REPORTS,
      icon: FileText,
      // Solo visible para gerentes
      showForRoles: [USER_ROLES.GERENTE] as UserRole[],
    },
    {
      title: "Configuración",
      url: ROUTES.SETTINGS,
      icon: Settings,
    },
  ].filter(item => {
    // Filtrar por roles si se especifica
    if (item.showForRoles && user?.role) {
      return item.showForRoles.includes(user.role as UserRole)
    }
    return true
  })

  // Datos del usuario
  const userData = {
    name: user?.name || "Usuario",
    email: user?.email || "usuario@fraudguard.com",
    avatar: user?.avatar || "/avatars/default.jpg",
    role: user?.role || "usuario",
  }

  return (
    <Sidebar collapsible="icon" className="sidebar-blue-accent" {...props}>
      <SidebarHeader className="sidebar-header-blue">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-blue-50/30 to-transparent">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="sidebar-footer-blue">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
} 