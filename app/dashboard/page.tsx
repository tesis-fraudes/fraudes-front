"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ModelStatus } from "@/components/dashboard/model-status"
import { useAuthStore } from "@/lib/auth-store"
import { BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.name} - Monitoreo y análisis de transacciones en tiempo real
          </p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="transacciones" className="space-y-4">
              <TabsList>
                <TabsTrigger value="transacciones">Transacciones Sospechosas</TabsTrigger>
                <TabsTrigger value="modelo">Estado del Modelo</TabsTrigger>
                {user?.role === "gerente" && <TabsTrigger value="reportes">Reportes</TabsTrigger>}
              </TabsList>

              <TabsContent value="transacciones">
                <TransactionsList userRole={user?.role || "usuario"} />
              </TabsContent>

              <TabsContent value="modelo">
                <ModelStatus />
              </TabsContent>

              {user?.role === "gerente" && (
                <TabsContent value="reportes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reportes Gerenciales</CardTitle>
                      <CardDescription>Métricas y análisis para toma de decisiones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                          <BarChart3 className="h-6 w-6 mb-2" />
                          Reporte Mensual
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                          <TrendingUp className="h-6 w-6 mb-2" />
                          Tendencias
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
