"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react"

interface TransactionsListProps {
  userRole: "usuario" | "analista" | "gerente"
}

export function TransactionsList({ userRole }: TransactionsListProps) {
  const transactions = [
    {
      id: "TXN-001",
      amount: "$2,450.00",
      merchant: "TechStore Online",
      riskScore: 85,
      status: "pendiente",
      timestamp: "2024-01-15 14:30",
    },
    {
      id: "TXN-002",
      amount: "$890.50",
      merchant: "Fashion Boutique",
      riskScore: 72,
      status: "pendiente",
      timestamp: "2024-01-15 13:45",
    },
    {
      id: "TXN-003",
      amount: "$156.99",
      merchant: "Local Restaurant",
      riskScore: 45,
      status: "aprobada",
      timestamp: "2024-01-15 12:20",
    },
  ]

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Alto Riesgo</Badge>
    if (score >= 60) return <Badge variant="secondary">Riesgo Medio</Badge>
    return <Badge variant="default">Bajo Riesgo</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pendiente: "secondary",
      aprobada: "default",
      rechazada: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Transacciones Sospechosas
        </CardTitle>
        <CardDescription>Transacciones que requieren revisión manual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{transaction.id}</span>
                  {getRiskBadge(transaction.riskScore)}
                  {getStatusBadge(transaction.status)}
                </div>
                <div className="text-sm text-gray-600">
                  {transaction.merchant} • {transaction.amount}
                </div>
                <div className="text-xs text-gray-500">{transaction.timestamp}</div>
              </div>

              {userRole === "analista" && transaction.status === "pendiente" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button size="sm" variant="default">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
