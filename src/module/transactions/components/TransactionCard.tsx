"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock, MapPin, CreditCard, Building } from "lucide-react";
import { SuspiciousTransaction } from "../services";

interface TransactionCardProps {
  transaction: SuspiciousTransaction;
  onViewDetails: (transactionId: string) => void;
  onApprove: (transactionId: string) => void;
  onReject: (transactionId: string) => void;
  isLoading?: boolean;
}

export default function TransactionCard({
  transaction,
  onViewDetails,
  onApprove,
  onReject,
  isLoading = false,
}: TransactionCardProps) {
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

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatCardNumber = (cardNumber: string) => {
    // Si el número ya está enmascarado, devolverlo tal como está
    if (cardNumber.includes("*")) {
      return cardNumber;
    }
    // Si es un número completo, enmascararlo
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length >= 4) {
      return `**** **** **** ${cleaned.slice(-4)}`;
    }
    return cardNumber;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          {/* Header con ID, badges y estado */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-lg">{transaction.id}</span>
            {getRiskBadge(transaction.riskScore)}
            {getStatusBadge(transaction.status)}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {formatTimestamp(transaction.timestamp)}
            </div>
          </div>

          {/* Información principal de la transacción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Comercio:</span>
                <span className="font-medium">{transaction.merchant}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Tarjeta:</span>
                <span className="font-mono">{formatCardNumber(transaction.cardNumber)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Monto:</span>
                <span className="font-medium text-lg">{formatAmount(transaction.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Ubicación:</span>
                <span>{transaction.location}</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Tipo de Fraude:</span>
              <span className="text-orange-600 font-medium">{transaction.fraudType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Riesgo:</span>
              <span className="font-medium">{transaction.riskScore}%</span>
            </div>
            {transaction.customerId && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Cliente:</span>
                <span className="font-medium">#{transaction.customerId}</span>
              </div>
            )}
            {transaction.businessId && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Negocio:</span>
                <span className="font-medium">#{transaction.businessId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent"
            onClick={() => onViewDetails(transaction.id)}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-1" />
            Detalles
          </Button>
          {transaction.status === "pendiente" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove(transaction.id)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(transaction.id)}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rechazar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
