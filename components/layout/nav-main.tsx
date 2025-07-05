"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    isActive?: boolean
    showForRoles?: string[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
      <SidebarMenu>
        {items.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.url || item.isActive

          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                variant={isActive ? "outline" : "default"}
                className={cn(
                  isActive 
                    ? "nav-item-active" 
                    : "nav-item-hover",
                  "transition-all duration-200 menu-item-glow"
                )}
              >
                <Link href={item.url} className="group">
                  <Icon className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                  )} />
                  <span className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-blue-700 font-semibold" : "text-gray-600 group-hover:text-blue-700 group-hover:font-medium"
                  )}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </ScrollArea>
  )
} 