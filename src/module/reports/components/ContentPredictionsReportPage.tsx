"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Filter, Brain, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getModelPredictions, exportModelPredictions, type ModelPrediction, type ReportQueryParams } from "../services";

export default function ContentPredictionsReportPage() {
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  // Agrupar predicciones por modelo (tolerante a undefined)
  const groupedPredictions = (predictions || []).reduce((acc, prediction) => {
    const key = `${prediction.model_name}_${prediction.model_version}`;
    if (!acc[key]) {
      acc[key] = {
        model_name: prediction.model_name,
        model_version: prediction.model_version,
        totalPredictions: 0,
        suspicious: 0,
        legitimate: 0,
        flagged: 0,
        lastPrediction: prediction.created_at,
      };
    }
    
    acc[key].totalPredictions++;
    if (prediction.prediction === "rejected") {
      acc[key].suspicious++;
    } else if (prediction.prediction === "approved") {
      acc[key].legitimate++;
    } else if (prediction.prediction === "flagged") {
      acc[key].flagged++;
    }
    
    if (new Date(prediction.created_at) > new Date(acc[key].lastPrediction)) {
      acc[key].lastPrediction = prediction.created_at;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const filteredPredictions = Object.values(groupedPredictions).filter((prediction: any) =>
    prediction.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prediction.model_version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      const params: ReportQueryParams = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        limit: 1000,
        offset: 0,
      };
      
      const response = await getModelPredictions(params);
      setPredictions(Array.isArray(response?.data) ? response.data : []);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al cargar predicciones";
      toast.error(`Error al cargar predicciones: ${errorMessage}`);
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
      
      const blob = await exportModelPredictions(params);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `predicciones_${dateRange.start_date}_${dateRange.end_date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Reporte de predicciones exportado exitosamente");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al exportar";
      toast.error(`Error al exportar: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [dateRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSuspiciousRate = (suspicious: number, total: number) => {
    return total > 0 ? ((suspicious / total) * 100).toFixed(1) : "0";
  };

  const totalStats = Object.values(groupedPredictions).reduce((acc: any, prediction: any) => {
    acc.totalPredictions += prediction.totalPredictions;
    acc.suspicious += prediction.suspicious;
    acc.legitimate += prediction.legitimate;
    acc.flagged += prediction.flagged;
    return acc;
  }, { totalPredictions: 0, suspicious: 0, legitimate: 0, flagged: 0 });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Reporte de Predicciones Realizadas
          </h1>
          <p className="text-gray-600 mt-1">Análisis de modelos y predicciones generadas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadPredictions} disabled={isLoading} variant="outline">
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
                placeholder="Buscar por modelo o versión..."
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
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Modelos</p>
                <p className="text-2xl font-bold">{Object.keys(groupedPredictions).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Predicciones</p>
                <p className="text-2xl font-bold">
                  {totalStats.totalPredictions.toLocaleString()}
                </p>
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
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">
                  {totalStats.suspicious.toLocaleString()}
                </p>
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
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalStats.legitimate.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de predicciones */}
      <Card>
        <CardHeader>
          <CardTitle>Predicciones por Modelo</CardTitle>
          <CardDescription>
            Detalle de predicciones realizadas por cada modelo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Cargando predicciones...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Aprobadas</TableHead>
                  <TableHead className="text-center">Rechazadas</TableHead>
                  <TableHead className="text-center">Marcadas</TableHead>
                  <TableHead className="text-center">% Rechazadas</TableHead>
                  <TableHead>Última Predicción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron predicciones para el rango de fechas seleccionado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPredictions.map((prediction: any, index: number) => (
                    <TableRow key={`${prediction.model_name}_${prediction.model_version}_${index}`}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {prediction.model_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{prediction.model_version}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {prediction.totalPredictions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-semibold">
                        {prediction.legitimate.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-red-600 font-semibold">
                        {prediction.suspicious.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-orange-600 font-semibold">
                        {prediction.flagged.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={parseFloat(getSuspiciousRate(prediction.suspicious, prediction.totalPredictions)) > 10 ? "destructive" : "secondary"}
                        >
                          {getSuspiciousRate(prediction.suspicious, prediction.totalPredictions)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(prediction.lastPrediction)}
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
