"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      type: "approval",
      message: "Transacción TXN-045 aprobada",
      timestamp: "Hace 5 min",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      type: "rejection",
      message: "Transacción TXN-044 rechazada",
      timestamp: "Hace 12 min",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      type: "detection",
      message: "Nueva transacción sospechosa detectada",
      timestamp: "Hace 18 min",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      type: "approval",
      message: "Transacción TXN-042 aprobada",
      timestamp: "Hace 25 min",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>Últimas acciones del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <activity.icon className={`h-4 w-4 mt-1 ${activity.color}`} />
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
