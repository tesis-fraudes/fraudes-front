"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, Calendar, Bot, CreditCard, Building, TrendingUp } from "lucide-react";
import { toast } from "sonner";

// Tipos para transacciones automáticas
interface AutomaticTransaction {
  id: string;
  transactionId: string;
  customer: string;
  business: string;
  paymentMethod: string;
  date: string;
  score: number;
  model: string;
  amount: number;
  status: "processed" | "flagged" | "approved" | "rejected";
}

// Datos mock para el ejemplo
const mockAutomaticTransactions: AutomaticTransaction[] = [
  {
    id: "1",
    transactionId: "AUTO-001234",
    customer: "Juan Pérez",
    business: "Tienda Online S.A.",
    paymentMethod: "Tarjeta de Crédito",
    date: "2024-01-25T14:30:00Z",
    score: 85,
    model: "fraud-detector-v2",
    amount: 1250.50,
    status: "flagged",
  },
  {
    id: "2",
    transactionId: "AUTO-001235",
    customer: "María García",
    business: "Supermercado Central",
    paymentMethod: "PayPal",
    date: "2024-01-25T15:45:00Z",
    score: 15,
    model: "fraud-detector-v2",
    amount: 89.99,
    status: "approved",
  },
  {
    id: "3",
    transactionId: "AUTO-001236",
    customer: "Carlos López",
    business: "Restaurante El Buen Sabor",
    paymentMethod: "Transferencia",
    date: "2024-01-25T16:20:00Z",
    score: 92,
    model: "fraud-detector-v1",
    amount: 450.00,
    status: "rejected",
  },
  {
    id: "4",
    transactionId: "AUTO-001237",
    customer: "Ana Martínez",
    business: "Farmacia San José",
    paymentMethod: "Tarjeta de Débito",
    date: "2024-01-25T17:10:00Z",
    score: 25,
    model: "fraud-detector-v2",
    amount: 35.75,
    status: "approved",
  },
  {
    id: "5",
    transactionId: "AUTO-001238",
    customer: "Pedro Sánchez",
    business: "Gasolinera Express",
    paymentMethod: "Tarjeta de Crédito",
    date: "2024-01-25T18:30:00Z",
    score: 78,
    model: "fraud-detector-v1",
    amount: 1200.00,
    status: "flagged",
  },
];

export default function ContentAutomaticTransactionsReportPage() {
  const [transactions] = useState<AutomaticTransaction[]>(mockAutomaticTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.business.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesModel = modelFilter === "all" || transaction.model === modelFilter;
    
    let matchesScore = true;
    if (scoreFilter !== "all") {
      const score = transaction.score;
      switch (scoreFilter) {
        case "low":
          matchesScore = score <= 50;
          break;
        case "medium":
          matchesScore = score > 50 && score < 75;
          break;
        case "high":
          matchesScore = score >= 75;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesModel && matchesScore;
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Reporte de transacciones automáticas exportado exitosamente");
    } catch {
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getScoreBadge = (score: number) => {
    if (score <= 50) {
      return <Badge className="bg-green-100 text-green-800">Bajo ({score})</Badge>;
    } else if (score < 75) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medio ({score})</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Alto ({score})</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-blue-100 text-blue-800">Procesada</Badge>;
      case "flagged":
        return <Badge className="bg-orange-100 text-orange-800">Marcada</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const stats = {
    total: transactions.length,
    processed: transactions.filter(t => t.status === "processed").length,
    flagged: transactions.filter(t => t.status === "flagged").length,
    approved: transactions.filter(t => t.status === "approved").length,
    rejected: transactions.filter(t => t.status === "rejected").length,
    lowRisk: transactions.filter(t => t.score < 30).length,
    mediumRisk: transactions.filter(t => t.score >= 30 && t.score < 70).length,
    highRisk: transactions.filter(t => t.score >= 70).length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            Reporte de Transacciones Automáticas
          </h1>
          <p className="text-gray-600 mt-1">Transacciones procesadas automáticamente por modelos de IA</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, cliente o negocio..."
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
                <SelectItem value="processed">Procesada</SelectItem>
                <SelectItem value="flagged">Marcada</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los modelos</SelectItem>
                <SelectItem value="fraud-detector-v1">Fraud Detector v1</SelectItem>
                <SelectItem value="fraud-detector-v2">Fraud Detector v2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel de Riesgo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="low">Bajo (&lt; 30)</SelectItem>
                <SelectItem value="medium">Medio (30-69)</SelectItem>
                <SelectItem value="high">Alto (≥ 70)</SelectItem>
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
              <Bot className="h-5 w-5 text-blue-600" />
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
              <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bajo Riesgo</p>
                <p className="text-2xl font-bold text-green-600">{stats.lowRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Medio Riesgo</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.mediumRisk}</p>
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
                <p className="text-sm text-gray-600">Alto Riesgo</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
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
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold">{formatAmount(stats.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Automáticas</CardTitle>
          <CardDescription>
            Detalle de transacciones procesadas automáticamente por modelos de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transacción</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Negocio</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono font-medium">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.customer}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    {transaction.business}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {transaction.paymentMethod}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell>{getScoreBadge(transaction.score)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {transaction.model}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
