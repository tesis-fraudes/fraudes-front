"use client";

import { useState } from "react";
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

interface ModelData {
  name: string;
  file: File | null;
  uploadedBy: string;
  uploadedAt: Date;
}

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

// Datos simulados para el historial de modelos
const mockModels: ModelHistoryItem[] = [
  {
    id: "1",
    name: "Modelo_Fraude_v2.1",
    version: "2.1.3",
    uploadedBy: "Ana García",
    uploadedAt: new Date("2024-01-15T09:30:00"),
    fileSize: 15.7 * 1024 * 1024, // 15.7 MB
    isActive: true,
    accuracy: 94.2,
    status: 'active',
  },
  {
    id: "2",
    name: "Modelo_Fraude_v2.0",
    version: "2.0.1",
    uploadedBy: "Carlos López",
    uploadedAt: new Date("2024-01-10T14:20:00"),
    fileSize: 12.3 * 1024 * 1024, // 12.3 MB
    isActive: false,
    accuracy: 91.8,
    status: 'inactive',
  },
  {
    id: "3",
    name: "Modelo_Fraude_v1.9",
    version: "1.9.5",
    uploadedBy: "María Rodríguez",
    uploadedAt: new Date("2024-01-05T11:15:00"),
    fileSize: 10.8 * 1024 * 1024, // 10.8 MB
    isActive: false,
    accuracy: 89.3,
    status: 'inactive',
  },
  {
    id: "4",
    name: "Modelo_Fraude_v2.2_Beta",
    version: "2.2.0-beta",
    uploadedBy: "Juan Pérez",
    uploadedAt: new Date("2024-01-20T16:45:00"),
    fileSize: 18.2 * 1024 * 1024, // 18.2 MB
    isActive: false,
    accuracy: undefined,
    status: 'training',
  },
];

export default function ModelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [models, setModels] = useState<ModelHistoryItem[]>(mockModels);

  const handleSaveModel = async (modelData: ModelData) => {
    // Simular guardado del modelo
    const newModel: ModelHistoryItem = {
      id: Date.now().toString(),
      name: modelData.name,
      version: "1.0.0",
      uploadedBy: modelData.uploadedBy,
      uploadedAt: modelData.uploadedAt,
      fileSize: modelData.file?.size || 0,
      isActive: false,
      accuracy: undefined,
      status: 'inactive',
    };
    
    setModels(prev => [newModel, ...prev]);
    console.log("Modelo guardado:", modelData);
  };

  const handleViewModel = (model: ModelHistoryItem) => {
    console.log("Ver modelo:", model);
    // Aquí se abriría un modal con detalles del modelo
  };

  const handleDownloadModel = (model: ModelHistoryItem) => {
    console.log("Descargar modelo:", model);
    // Aquí se descargaría el archivo del modelo
  };

  const handleDeleteModel = (model: ModelHistoryItem) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el modelo "${model.name}"?`)) {
      setModels(prev => prev.filter(m => m.id !== model.id));
      console.log("Modelo eliminado:", model);
    }
  };

  const handleActivateModel = (model: ModelHistoryItem) => {
    setModels(prev => prev.map(m => ({
      ...m,
      isActive: m.id === model.id,
      status: m.id === model.id ? 'active' : 'inactive'
    })));
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
        onDownloadModel={handleDownloadModel}
        onDeleteModel={handleDeleteModel}
        onActivateModel={handleActivateModel}
      />

      {/* Modal para agregar modelos */}
      <AddModelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveModel}
      />

      {/* Modal de configuración del modelo */}
      <ModelConfigModal
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
      />
    </div>
  );
}
