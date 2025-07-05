"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Función para obtener el título de la página actual
  const getPageTitle = (path: string) => {
    switch (path) {
      case ROUTES.HOME:
        return "Dashboard";
      case ROUTES.TRANSACTIONS:
        return "Transacciones";
      case ROUTES.MODEL:
        return "Modelo IA";
      case ROUTES.REPORTS:
        return "Reportes";
      case ROUTES.SETTINGS:
        return "Configuración";
      default:
        return "Página";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 header-blue-accent">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 hover:bg-blue-50 hover:text-blue-600 rounded-md p-1 transition-all duration-200 hover:shadow-sm" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-gray-300"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={ROUTES.HOME} className="text-blue-600 hover:text-blue-700 font-medium">
                    FraudGuard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-700 font-semibold">{getPageTitle(pathname)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50/30">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
