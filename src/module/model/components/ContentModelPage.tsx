"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Brain, Settings, RefreshCw, Pause, Plus, Upload } from "lucide-react";
import { useRoleAccess, Permission } from "@/module/guard";
import { AddModelModal } from "./add-model-modal";
import { ModelConfigModal } from "./model-config-modal";
import { ModelDetailModal, type ModelDetail } from "./model-detail-modal";
import { ModelHistory } from "./model-history";
import { useModelStore, type ModelData } from "../store/model.store";


export function ContentModelPage() {
  const { canAccess, hasPermission } = useRoleAccess();
  const { 
    error,
    fetchModels, 
    activateModel, 
    pauseModel, 
    trainModel,
    getActiveModel,
    clearError
  } = useModelStore();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelDetail | null>(null);

  const activeModel = getActiveModel();

  const handleUploadModel = () => {
    if (!hasPermission(Permission.MODEL_CREATE)) return;
    setIsUploadModalOpen(true);
  };

  const handleActivateModel = (model: ModelData) => {
    if (!hasPermission(Permission.MODEL_ACTIVATE)) return;
    activateModel(model.id);
  };

  const handleTrainModel = () => {
    if (!hasPermission(Permission.MODEL_TRAIN) || !activeModel) return;
    trainModel(activeModel.id);
  };

  const handleConfigureModel = () => {
    if (!hasPermission(Permission.MODEL_CONFIGURE)) return;
    setIsConfigModalOpen(true);
  };

  const handleViewModel = (model: ModelData) => {
    setSelectedModel(model);
    setIsDetailModalOpen(true);
  };

  const handleModelUploadSuccess = () => {
    // Refrescar la lista de modelos después de subir uno nuevo
    fetchModels();
  };

  const handlePauseModel = () => {
    if (!hasPermission(Permission.MODEL_ACTIVATE) || !activeModel) return;
    pauseModel(activeModel.id);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modelo de IA</h1>
          <h2 className="text-3xl font-bold tracking-tight">
            PK1 - Evaluación Automática de Transacciones
          </h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchModels}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          {hasPermission(Permission.MODEL_CREATE) && (
            <Button onClick={handleUploadModel} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Subir Modelo
            </Button>
          )}
        </div>
      </div>

      {/* Banner de error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error: {error}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="text-red-600 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección para gestión de modelos */}
      {canAccess.model && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Gestión de Modelos
            </CardTitle>
            <CardDescription>
              Sube y gestiona modelos de IA para la detección de fraudes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {hasPermission(Permission.MODEL_CREATE) && (
                <Button variant="outline" onClick={handleUploadModel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Modelo
                </Button>
              )}
              {hasPermission(Permission.MODEL_TRAIN) && activeModel && (
                <Button 
                  variant="outline" 
                  onClick={handleTrainModel}
                  disabled={activeModel.status === "training"}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${activeModel.status === "training" ? "animate-spin" : ""}`} />
                  {activeModel.status === "training" ? "Entrenando..." : "Reentrenar"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado del Modelo Activo */}
      {activeModel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelo Activo
            </CardTitle>
            <CardDescription>Información del modelo de detección actualmente en uso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Versión</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{activeModel.version}</span>
                  <Badge 
                    variant={activeModel.status === "active" ? "default" : "secondary"}
                    className={activeModel.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {activeModel.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Última Actualización</label>
                <span className="text-sm text-gray-600">
                  {activeModel.uploadedAt.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subido por</label>
                <span className="text-sm text-gray-600">{activeModel.uploadedBy}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamaño del Archivo</label>
                <span className="text-sm text-gray-600">{activeModel.fileSize} MB</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Precisión del Modelo</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeModel.accuracy || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{activeModel.accuracy?.toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-gray-500">Verdaderos Positivos</div>
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

            <div className="flex gap-2 flex-wrap">
              {hasPermission(Permission.MODEL_ACTIVATE) && (
                <Button 
                  variant="outline" 
                  onClick={handlePauseModel}
                  disabled={activeModel.status === "training"}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              )}
              {hasPermission(Permission.MODEL_CONFIGURE) && (
                <Button variant="outline" onClick={handleConfigureModel}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              )}
              {hasPermission(Permission.MODEL_TRAIN) && (
                <Button 
                  variant="outline" 
                  onClick={handleTrainModel}
                  disabled={activeModel.status === "training"}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${activeModel.status === "training" ? "animate-spin" : ""}`} />
                  {activeModel.status === "training" ? "Entrenando..." : "Reentrenar"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de Modelos */}
      <ModelHistory 
        onActivateModel={handleActivateModel}
        onViewModel={handleViewModel}
      />

      {/* Modales */}
      <AddModelModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onSuccess={handleModelUploadSuccess}
      />

      <ModelConfigModal
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
      />

      <ModelDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        model={selectedModel}
      />
    </div>
  );
}
