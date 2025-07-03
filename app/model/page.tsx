"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Settings, RefreshCw, Pause, Upload } from "lucide-react"

export default function ModelPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Modelo de IA</h1>
          <p className="text-gray-600 mt-2">PK1 - Evaluación Automática de Transacciones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Estado del Modelo
              </CardTitle>
              <CardDescription>Información actual del modelo de detección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Versión</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">v2.1.3</span>
                    <Badge variant="default">Activo</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Última Actualización</label>
                  <span className="text-sm text-gray-600">15 Enero 2024, 09:30</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Precisión del Modelo</label>
                <div className="flex items-center gap-2">
                  <Progress value={94.2} className="flex-1" />
                  <span className="text-sm font-medium">94.2%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-xs text-gray-500">Verdaderos Positivos</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600">89</div>
                  <div className="text-xs text-gray-500">Falsos Positivos</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Falsos Negativos</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración del Modelo</CardTitle>
              <CardDescription>CUS02 - Configurar Modelo Nuevo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dataset de Entrenamiento</label>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Cargar Dataset
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parámetros del Modelo</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Learning Rate</label>
                    <input className="w-full px-2 py-1 text-sm border rounded" defaultValue="0.001" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Epochs</label>
                    <input className="w-full px-2 py-1 text-sm border rounded" defaultValue="100" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Iniciar Entrenamiento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
