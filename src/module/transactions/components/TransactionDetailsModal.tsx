"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { 
  CreditCard, 
  MapPin, 
  Smartphone, 
  Shield, 
  Clock, 
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { SuspiciousTransaction } from "../services";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SuspiciousTransaction | null;
}

export function TransactionDetailsModal({ 
  isOpen, 
  onClose, 
  transaction 
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprobada":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rechazada":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprobada":
        return "bg-green-100 text-green-800 border-green-200";
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return "bg-red-100 text-red-800 border-red-200";
    if (riskScore >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detalles de la Transacción
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Información Principal</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status.toUpperCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">ID de Transacción</label>
                  <p className="text-lg font-mono">{transaction.id}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Monto</label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Puntuación de Riesgo</label>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(transaction.riskScore)}>
                      {transaction.riskScore}%
                    </Badge>
                    <span className="text-sm text-gray-600">{transaction.fraudType}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Fecha y Hora</label>
                  <p className="text-sm">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Comercio y Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Información del Comercio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Comercio</label>
                  <p className="font-medium">{transaction.merchant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID del Negocio</label>
                  <p className="font-mono text-sm">{transaction.businessId}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID del Cliente</label>
                  <p className="font-mono text-sm">{transaction.customerId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tarjeta</label>
                  <p className="font-mono text-sm">{transaction.cardNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Técnica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Información Técnica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Dispositivo</label>
                  <p className="text-sm">{transaction.deviceInfo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Ubicación</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{transaction.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Dirección IP</label>
                  <p className="font-mono text-sm">{transaction.ipAddress}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Tarjeta</label>
                  <p className="font-mono text-sm">{transaction.cardNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Monto de la Transacción</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
