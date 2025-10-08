"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { 
  CreditCard, 
  MapPin, 
  Smartphone, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  History,
  Wallet,
  Loader2
} from "lucide-react";
import type { SuspiciousTransaction } from "../services";
import { 
  getCustomerLastMovements, 
  getCustomerFraudHistory, 
  getCustomerActivePaymentMethods,
  type CustomerLastMovements,
  type CustomerFraudHistory
} from "../services";

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
  const [lastMovements, setLastMovements] = useState<CustomerLastMovements | null>(null);
  const [fraudHistory, setFraudHistory] = useState<CustomerFraudHistory | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoadingAdditionalData, setIsLoadingAdditionalData] = useState(false);

  useEffect(() => {
    if (isOpen && transaction) {
      loadAdditionalData();
    }
  }, [isOpen, transaction]);

  const loadAdditionalData = async () => {
    if (!transaction) return;
    
    setIsLoadingAdditionalData(true);
    try {
      const businessId = Number(transaction.businessId);
      const customerId = Number(transaction.customerId);

      // Cargar datos en paralelo
      const [movements, frauds, methods] = await Promise.all([
        getCustomerLastMovements(businessId, customerId),
        getCustomerFraudHistory(businessId, customerId),
        getCustomerActivePaymentMethods(customerId)
      ]);

      setLastMovements(movements);
      setFraudHistory(frauds);
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error al cargar datos adicionales:", error);
    } finally {
      setIsLoadingAdditionalData(false);
    }
  };

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
    if (riskScore >= 75) return "bg-red-100 text-red-800 border-red-200";
    if (riskScore >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
      <DialogContent className=" max-h-[90vh] min-w-[60vw] overflow-y-auto">
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
          
          {/* Datos Adicionales del Cliente */}
          {isLoadingAdditionalData ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">Cargando información del cliente...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Últimos Movimientos y Media de Gasto */}
              {lastMovements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Últimos Movimientos
                      </div>
                      <Badge variant="outline" className="font-normal">
                        {lastMovements.total_transactions} transacciones totales
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <label className="text-sm font-medium text-blue-700">Media de Gasto</label>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatAmount(lastMovements.average_spend)}
                      </p>
                    </div>
                    
                    {lastMovements.last_transactions.length > 0 ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Últimas Transacciones</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {lastMovements.last_transactions.map((tx, index) => (
                            <div 
                              key={tx.id || index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{tx.business.tradeName}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(tx.date).toLocaleString('es-MX')}
                                </p>
                              </div>
                              <p className="font-semibold text-green-600">
                                {formatAmount(tx.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay transacciones previas registradas
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Métodos de Pago Activos */}
              {paymentMethods && paymentMethods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Métodos de Pago Activos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {paymentMethods.map((method, index) => (
                        <div 
                          key={method.id || index}
                          className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-sm">{method.type}</span>
                            </div>
                            <Badge 
                              variant="outline"
                              className={method.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            >
                              {method.status}
                            </Badge>
                          </div>
                          <p className="font-mono text-lg">**** **** **** {method.last_four}</p>
                          {method.expiry_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Expira: {method.expiry_date}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Historial de Fraudes */}
              {fraudHistory && (
                <Card className={fraudHistory.fraud_count > 0 ? 'border-red-200 bg-red-50' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-red-600" />
                        <span className={fraudHistory.fraud_count > 0 ? 'text-red-700' : ''}>
                          Historial de Fraudes
                        </span>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          fraudHistory.fraud_count > 0 
                            ? 'bg-red-100 text-red-700 border-red-300' 
                            : 'bg-green-100 text-green-700 border-green-300'
                        }
                      >
                        {fraudHistory.fraud_count} fraude{fraudHistory.fraud_count !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fraudHistory.fraud_count > 0 ? (
                      <div className="space-y-3">
                        {fraudHistory.last_fraud_date && (
                          <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                            <label className="text-sm font-medium text-red-700">Último Fraude Detectado</label>
                            <p className="text-sm text-red-900">
                              {new Date(fraudHistory.last_fraud_date).toLocaleString('es-MX')}
                            </p>
                          </div>
                        )}
                        
                        {fraudHistory.fraud_transactions.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            <label className="text-sm font-medium text-red-700">Transacciones Fraudulentas</label>
                            {fraudHistory.fraud_transactions.map((fraud, index) => (
                              <div 
                                key={fraud.id || index}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                                      {fraud.fraud_type}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {fraud.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {new Date(fraud.date).toLocaleString('es-MX')}
                                  </p>
                                </div>
                                <p className="font-semibold text-red-600">
                                  {formatAmount(fraud.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-700">
                          Sin historial de fraudes
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Este cliente no tiene transacciones fraudulentas previas
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
