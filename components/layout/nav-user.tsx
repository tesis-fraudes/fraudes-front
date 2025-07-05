"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { ROUTES } from "@/lib/constants"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push(ROUTES.LOGIN)
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="hover:bg-blue-100/50 transition-all duration-200 group">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8 ring-2 ring-blue-200 group-hover:ring-blue-300 transition-all duration-200 flex-shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white font-medium">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-200 truncate w-full">{user.name}</span>
              <span className="text-xs text-blue-600 font-medium capitalize group-hover:text-blue-700 transition-colors duration-200 truncate w-full">{user.role}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={handleLogout}
          className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 group w-full"
        >
          <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200 flex-shrink-0" />
          <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors duration-200 truncate">Cerrar Sesión</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 