"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Brain, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getModelPredictions, exportModelPredictions, type ModelPrediction, type ReportQueryParams } from "../services";

export default function ContentPredictionsReportPage() {
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

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


  // Calcular estadísticas totales
  const totalStats = (predictions || []).reduce((acc: any, prediction: any) => {
    acc.totalPredictions++;
    // prediction: 0 = fraude/rechazada, 1 = legítima/aprobada
    // class: "suspicious", "legit", "fraudulent"
    if (prediction.prediction === 0 && prediction.class === "suspicious") {
      acc.suspicious++;
    } else if (prediction.class === "legit" || prediction.prediction === 1) {
      acc.legitimate++;
    } else if (prediction.prediction === 0) {
      acc.rejected++;
    }
    return acc;
  }, { totalPredictions: 0, suspicious: 0, legitimate: 0, rejected: 0 });

  // Calcular cantidad de modelos únicos
  const uniqueModels = new Set((predictions || []).map(p => `${p.model_name}_${p.model_id}`)).size;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-sm text-gray-600">Modelos Únicos</p>
                <p className="text-2xl font-bold">{uniqueModels}</p>
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
              <div className="h-5 w-5 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sospechosas</p>
                <p className="text-2xl font-bold text-orange-600">
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
          <CardTitle>Predicciones Realizadas</CardTitle>
          <CardDescription>
            Listado de todas las predicciones realizadas por los modelos
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
                  <TableHead>ID Predicción</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Negocio</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-center">Score Fraude</TableHead>
                  <TableHead className="text-center">Clasificación</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron predicciones para el rango de fechas seleccionado
                    </TableCell>
                  </TableRow>
                ) : (
                  predictions.map((prediction: any) => (
                    <TableRow key={prediction.prediction_id}>
                      <TableCell className="font-mono text-sm">
                        #{prediction.prediction_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Badge variant="outline" className="font-mono w-fit">
                            {prediction.model_name}
                          </Badge>
                          <span className="text-xs text-gray-500 mt-1">ID: {prediction.model_id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{prediction.customer_name}</span>
                          <span className="text-xs text-gray-500">ID: {prediction.customer_id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{prediction.trade_name || prediction.company_name}</span>
                          <span className="text-xs text-gray-500">{prediction.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: prediction.currency || 'USD'
                        }).format(prediction.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={prediction.fraud_score >= 75 ? "destructive" : prediction.fraud_score >= 51 ? "default" : "secondary"}
                        >
                          {prediction.fraud_score}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            prediction.class === "suspicious" ? "default" : 
                            prediction.class === "legit" ? "secondary" : 
                            "destructive"
                          }
                          className={
                            prediction.class === "suspicious" ? "bg-orange-100 text-orange-700" : 
                            prediction.class === "legit" ? "bg-green-100 text-green-700" : 
                            ""
                          }
                        >
                          {prediction.class === "suspicious" ? "Sospechosa" : 
                           prediction.class === "legit" ? "Legítima" : 
                           "Fraudulenta"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(prediction.created_at)}
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
