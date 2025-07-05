"use client"

import * as React from "react"
import { ChevronDown, Shield } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { APP_CONFIG } from "@/lib/constants"

interface Team {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
}

interface TeamSwitcherProps {
  teams: Team[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [selectedTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-blue-100/50 transition-all duration-200 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 flex-shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
            <span className="text-sm font-medium text-blue-900 group-hover:text-blue-800 transition-all duration-200 truncate w-full">{APP_CONFIG.NAME}</span>
            <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-all duration-200 truncate w-full">{selectedTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 