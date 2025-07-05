"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    {
      id: "TXN-001",
      amount: "$2,450.00",
      merchant: "TechStore Online",
      cardNumber: "**** **** **** 1234",
      location: "Nueva York, NY",
      riskScore: 85,
      status: "pendiente",
      timestamp: "2024-01-15 14:30",
      fraudType: "Transacción inusual",
    },
    {
      id: "TXN-002",
      amount: "$890.50",
      merchant: "Fashion Boutique",
      cardNumber: "**** **** **** 5678",
      location: "Los Ángeles, CA",
      riskScore: 72,
      status: "pendiente",
      timestamp: "2024-01-15 13:45",
      fraudType: "Monto elevado",
    },
    {
      id: "TXN-003",
      amount: "$156.99",
      merchant: "Local Restaurant",
      cardNumber: "**** **** **** 9012",
      location: "Miami, FL",
      riskScore: 45,
      status: "aprobada",
      timestamp: "2024-01-15 12:20",
      fraudType: "Ubicación sospechosa",
    },
  ];

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Alto Riesgo</Badge>;
    if (score >= 60) return <Badge variant="secondary">Riesgo Medio</Badge>;
    return <Badge variant="default">Bajo Riesgo</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pendiente: "secondary",
      aprobada: "default",
      rechazada: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revisión Manual</h1>
        <p className="text-gray-600 mt-2">
          PK2 - Transacciones Sospechosas para Análisis
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, comercio o tarjeta..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transacciones Sospechosas ({transactions.length})
          </CardTitle>
          <CardDescription>
            Transacciones que requieren revisión manual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">
                        {transaction.id}
                      </span>
                      {getRiskBadge(transaction.riskScore)}
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Comercio:</span>
                        <span className="ml-2 font-medium">
                          {transaction.merchant}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Monto:</span>
                        <span className="ml-2 font-medium">
                          {transaction.amount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tarjeta:</span>
                        <span className="ml-2 font-mono">
                          {transaction.cardNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ubicación:</span>
                        <span className="ml-2">{transaction.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">Tipo de Fraude:</span>
                      <span className="text-orange-600 font-medium">
                        {transaction.fraudType}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        Riesgo: {transaction.riskScore}%
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        {transaction.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalles
                    </Button>
                    {transaction.status === "pendiente" && (
                      <>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
