"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Filter, XCircle, RefreshCw, CreditCard, User, Building } from "lucide-react";
import { toast } from "sonner";
import { getRejectedTransactions, exportRejectedTransactions, type RejectedTransaction, type ReportQueryParams } from "../services";

export default function ContentRejectedTransactionsReportPage() {
  const [transactions, setTransactions] = useState<RejectedTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const filteredTransactions = (transactions || []).filter(transaction =>
    transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.rejected_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const params: ReportQueryParams = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        limit: 1000,
        offset: 0,
      };
      
      const response = await getRejectedTransactions(params);
      setTransactions(Array.isArray(response?.data) ? response.data : []);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al cargar transacciones";
      toast.error(`Error al cargar transacciones: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      };
      
      const blob = await exportRejectedTransactions(params);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacciones_rechazadas_${dateRange.start_date}_${dateRange.end_date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Reporte de transacciones rechazadas exportado exitosamente");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al exportar";
      toast.error(`Error al exportar: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getRiskBadge = (score: number) => {
    if (score < 30) {
      return <Badge className="bg-green-100 text-green-800">Bajo ({score})</Badge>;
    } else if (score < 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medio ({score})</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Alto ({score})</Badge>;
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgRiskScore = transactions.length > 0 ? 
    (transactions.reduce((sum, t) => sum + t.risk_score, 0) / transactions.length).toFixed(1) : 0;

  useEffect(() => {
    loadTransactions();
  }, [dateRange]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <XCircle className="h-8 w-8 text-red-600" />
            Reporte de Transacciones Rechazadas
          </h1>
          <p className="text-gray-600 mt-1">Transacciones que han sido rechazadas manualmente</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTransactions} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleExport} disabled={isExporting || isLoading} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exportando..." : "Exportar Reporte"}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, cliente, negocio o analista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Fecha inicio</label>
              <Input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Fecha fin</label>
              <Input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Rechazadas</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold">{formatAmount(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Score Promedio</p>
                <p className="text-2xl font-bold">{avgRiskScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Analistas Únicos</p>
                <p className="text-2xl font-bold">
                  {new Set(transactions.map(t => t.rejected_by)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Rechazadas</CardTitle>
          <CardDescription>
            Detalle de transacciones que han sido rechazadas manualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Cargando transacciones...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transacción</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Negocio</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Analista</TableHead>
                  <TableHead>Fecha Rechazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No se encontraron transacciones rechazadas para el rango de fechas seleccionado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono font-medium">
                        {transaction.transaction_id}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.customer_name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        {transaction.business_name}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        {transaction.payment_method}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatAmount(transaction.amount)}
                      </TableCell>
                      <TableCell>{getRiskBadge(transaction.risk_score)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {transaction.model_used}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {transaction.rejected_by}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(transaction.rejected_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
