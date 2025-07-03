"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Settings, RefreshCw } from "lucide-react"

export function ModelStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Estado del Modelo de IA
        </CardTitle>
        <CardDescription>Información del modelo de detección de fraudes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Versión del Modelo</label>
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
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reentrenar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
