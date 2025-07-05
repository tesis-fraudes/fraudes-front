"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { ROUTES } from "@/lib/constants"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default",
  className = "",
  children 
}: LogoutButtonProps) {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    // Limpiar el store
    logout()
    
    // Redirigir inmediatamente al login
    router.push(ROUTES.LOGIN)
    
    // Forzar recarga para limpiar cualquier estado residual
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600" />
      <span className="group-hover:text-red-600">{children || "Cerrar Sesión"}</span>
    </Button>
  )
} 