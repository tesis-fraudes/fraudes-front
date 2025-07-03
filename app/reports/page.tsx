"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Download, FileText, PieChart } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reportes Gerenciales</h1>
          <p className="text-gray-600 mt-2">PK3 - Generación de Reportes y Análisis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Fraudes por Región
              </CardTitle>
              <CardDescription>Distribución geográfica de fraudes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Nueva York</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>California</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span>Texas</span>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex justify-between">
                  <span>Florida</span>
                  <span className="font-medium">15%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolución Temporal
              </CardTitle>
              <CardDescription>Fraudes detectados por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Enero</span>
                  <span className="font-medium">45 fraudes</span>
                </div>
                <div className="flex justify-between">
                  <span>Febrero</span>
                  <span className="font-medium">52 fraudes</span>
                </div>
                <div className="flex justify-between">
                  <span>Marzo</span>
                  <span className="font-medium">38 fraudes</span>
                </div>
                <div className="flex justify-between">
                  <span>Abril</span>
                  <span className="font-medium">61 fraudes</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Ver Reporte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Montos Involucrados
              </CardTitle>
              <CardDescription>Análisis financiero de fraudes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total detectado</span>
                  <span className="font-medium">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span>Promedio por caso</span>
                  <span className="font-medium">$12,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Máximo</span>
                  <span className="font-medium">$85,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Mínimo</span>
                  <span className="font-medium">$150</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
