"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, Calendar, UserCheck, User, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

// Tipos para transacciones manuales
interface ManualTransaction {
  id: string;
  transactionId: string;
  date: string;
  customer: string;
  analyst: string;
  result: "approved" | "rejected" | "pending";
  consequences: string;
  observations: string;
  status: "completed" | "in_progress" | "cancelled";
}

// Datos mock para el ejemplo
const mockManualTransactions: ManualTransaction[] = [
  {
    id: "1",
    transactionId: "TXN-001234",
    date: "2024-01-25T14:30:00Z",
    customer: "Juan Pérez",
    analyst: "María García",
    result: "approved",
    consequences: "levantar_alerta||notificar_cliente",
    observations: "Cliente validó identidad correctamente",
    status: "completed",
  },
  {
    id: "2",
    transactionId: "TXN-001235",
    date: "2024-01-25T15:45:00Z",
    customer: "Carlos López",
    analyst: "Ana Martínez",
    result: "rejected",
    consequences: "bloquear_medio_pago||alertar_banco",
    observations: "Se detectó patrón sospechoso en geolocalización",
    status: "completed",
  },
  {
    id: "3",
    transactionId: "TXN-001236",
    date: "2024-01-25T16:20:00Z",
    customer: "Laura Rodríguez",
    analyst: "Pedro Sánchez",
    result: "pending",
    consequences: "",
    observations: "Revisión en curso - esperando documentación adicional",
    status: "in_progress",
  },
  {
    id: "4",
    transactionId: "TXN-001237",
    date: "2024-01-25T17:10:00Z",
    customer: "Miguel Torres",
    analyst: "Sofia Herrera",
    result: "approved",
    consequences: "notificar_cliente",
    observations: "Transacción legítima - cliente confirmó compra",
    status: "completed",
  },
];

export default function ContentManualTransactionsReportPage() {
  const [transactions] = useState<ManualTransaction[]>(mockManualTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.analyst.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesResult = resultFilter === "all" || transaction.result === resultFilter;
    
    return matchesSearch && matchesStatus && matchesResult;
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Reporte de transacciones manuales exportado exitosamente");
    } catch (error) {
      toast.error("Error al exportar el reporte");
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

  const getResultIcon = (result: string) => {
    switch (result) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-800">En Progreso</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === "completed").length,
    inProgress: transactions.filter(t => t.status === "in_progress").length,
    approved: transactions.filter(t => t.result === "approved").length,
    rejected: transactions.filter(t => t.result === "rejected").length,
    pending: transactions.filter(t => t.result === "pending").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-blue-600" />
            Reporte de Transacciones Manuales
          </h1>
          <p className="text-gray-600 mt-1">Revisión manual de transacciones por analistas</p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exportando..." : "Exportar Reporte"}
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, cliente o analista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los resultados</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rango de fechas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-3 w-3 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-3 w-3 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Manuales</CardTitle>
          <CardDescription>
            Detalle de transacciones revisadas manualmente por analistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transacción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Consecuencias</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono font-medium">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.customer}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {transaction.analyst}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResultIcon(transaction.result)}
                      {getResultBadge(transaction.result)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {transaction.consequences || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {transaction.observations}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
