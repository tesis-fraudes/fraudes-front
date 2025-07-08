"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Settings, RefreshCw, Pause, Plus } from "lucide-react";
import { AddModelModal } from "@/components/model/add-model-modal";
import { ModelHistory } from "@/components/model/model-history";
import { ModelConfigModal } from "@/components/model/model-config-modal";
import { ModelDetailModal, ModelDetail } from "@/components/model/model-detail-modal";
import { getModels, getModelById } from "@/services/model.service";
import { toast } from "sonner";

interface ModelHistoryItem {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  isActive: boolean;
  accuracy?: number;
  status: 'active' | 'inactive' | 'training' | 'error';
}

export default function ModelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [models, setModels] = useState<ModelHistoryItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelDetail | null>(null);

  const fetchModels = async () => {
    try {
      const data = await getModels();
      setModels(data);
    } catch (error) {
      console.error("Error al obtener modelos:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleViewModel = async (model: ModelHistoryItem) => {
    try {
      const data = await getModelById(model.id);
      // Adaptar los datos recibidos al tipo ModelDetail
      setSelectedModel({
        id: data.id?.toString() || model.id,
        name: data.modelo || model.name,
        version: data.version || model.version,
        uploadedBy: "Desconocido",
        uploadedAt: data.createAt ? new Date(data.createAt) : model.uploadedAt,
        fileSize: 0,
        isActive: data.status === "Activo",
        accuracy: data.accuracy ? parseFloat(data.accuracy) * 100 : model.accuracy,
        status: data.status === "Activo" ? "active" : "inactive",
        urlFile: data.urlFile,
      });
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error al obtener detalles del modelo:", error);
    }
  };

  const handleActivateModel = (model: ModelHistoryItem) => {
    setModels(prev => prev.map(m => ({
      ...m,
      isActive: m.id === model.id,
      status: m.id === model.id ? 'active' : 'inactive'
    })));
    toast.success(`Modelo "${model.name}" activado`);
    console.log("Modelo activado:", model);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Modelo de IA</h1>
        <p className="text-gray-600 mt-2">
          PK1 - Evaluación Automática de Transacciones
        </p>
      </div>

      {/* Sección para agregar modelos */}
      <Card className="card-blue-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Gestión de Modelos
            </span>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="button-blue-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Modelo
            </Button>
          </CardTitle>
          <CardDescription>
            Sube y gestiona modelos de IA para la detección de fraudes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estado del Modelo - Ocupa toda la grilla */}
      <Card className="card-blue-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Estado del Modelo
          </CardTitle>
          <CardDescription>
            Información actual del modelo de detección activo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Versión</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">v2.1.3</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Activo</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Última Actualización
              </label>
              <span className="text-sm text-gray-600">
                15 Enero 2024, 09:30
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Subido por
              </label>
              <span className="text-sm text-gray-600">
                Ana García
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tamaño del Archivo
              </label>
              <span className="text-sm text-gray-600">
                15.7 MB
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Precisión del Modelo
            </label>
            <div className="flex items-center gap-2">
              <Progress value={94.2} className="flex-1" />
              <span className="text-sm font-medium">94.2%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-xs text-gray-500">
                Verdaderos Positivos
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">89</div>
              <div className="text-xs text-gray-500">Falsos Positivos</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-500">Falsos Negativos</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 button-blue-outline">
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 button-blue-outline"
              onClick={() => setIsConfigModalOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Button variant="outline" className="flex-1 button-blue-outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reentrenar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Modelos */}
      <ModelHistory
        models={models}
        onViewModel={handleViewModel}
        onActivateModel={handleActivateModel}
      />

      {/* Modal para agregar modelos */}
      <AddModelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchModels}
      />

      {/* Modal de configuración del modelo */}
      <ModelConfigModal
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
      />

      <ModelDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        model={selectedModel}
      />
    </div>
  );
}
