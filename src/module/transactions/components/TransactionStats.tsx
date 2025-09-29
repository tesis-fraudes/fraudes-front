"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionStatsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  isLoading?: boolean;
}

export default function TransactionStats({
  total,
  pending,
  approved,
  rejected,
  highRisk,
  mediumRisk,
  lowRisk,
  isLoading = false,
}: TransactionStatsProps) {
  const getRiskPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getStatusPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total de transacciones */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Total de Transacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-gray-500">Transacciones sospechosas</p>
        </CardContent>
      </Card>

      {/* Por estado */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Por Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pendientes</Badge>
              <span className="text-sm font-medium">{pending}</span>
            </div>
            <span className="text-xs text-gray-500">{getStatusPercentage(pending)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Aprobadas
              </Badge>
              <span className="text-sm font-medium">{approved}</span>
            </div>
            <span className="text-xs text-gray-500">{getStatusPercentage(approved)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Rechazadas
              </Badge>
              <span className="text-sm font-medium">{rejected}</span>
            </div>
            <span className="text-xs text-gray-500">{getStatusPercentage(rejected)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Por nivel de riesgo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Por Nivel de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Alto Riesgo</Badge>
              <span className="text-sm font-medium">{highRisk}</span>
            </div>
            <span className="text-xs text-gray-500">{getRiskPercentage(highRisk)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Riesgo Medio</Badge>
              <span className="text-sm font-medium">{mediumRisk}</span>
            </div>
            <span className="text-xs text-gray-500">{getRiskPercentage(mediumRisk)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default">Bajo Riesgo</Badge>
              <span className="text-sm font-medium">{lowRisk}</span>
            </div>
            <span className="text-xs text-gray-500">{getRiskPercentage(lowRisk)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de eficiencia */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Eficiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasa de Aprobación:</span>
              <span className="font-medium text-green-600">
                {total > 0 ? Math.round((approved / total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tasa de Rechazo:</span>
              <span className="font-medium text-red-600">
                {total > 0 ? Math.round((rejected / total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pendientes:</span>
              <span className="font-medium text-yellow-600">
                {total > 0 ? Math.round((pending / total) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
