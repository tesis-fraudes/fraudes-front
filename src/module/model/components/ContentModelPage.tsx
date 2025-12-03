"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Brain, RefreshCw, Plus, Upload } from "lucide-react";
import { useRoleAccess, Permission } from "@/module/guard";
import { AddModelModal } from "./add-model-modal";
import { ModelDetailModal, type ModelDetail } from "./model-detail-modal";
import { ModelHistory } from "./model-history";
import { useModelStore, type ModelData } from "../store/model.store";
import { toast } from "sonner";


export function ContentModelPage() {
  const { canAccess, hasPermission } = useRoleAccess();
  const { 
    error,
    fetchModels,
    fetchActiveModel,
    activateModel, 
    //pauseModel, 
    //trainModel,
    getActiveModel,
    clearError,
    isActiveModelLoading
  } = useModelStore();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelDetail | null>(null);

  const activeModel = getActiveModel();

  const notifiedNoActive = useRef(false);

  useEffect(() => {
    fetchActiveModel();
  }, [fetchActiveModel]);

  useEffect(() => {
    if (!isActiveModelLoading && !activeModel && !notifiedNoActive.current) {
      toast.info("No hay modelo activo", { description: "Activa un modelo desde el historial para comenzar." });
      notifiedNoActive.current = true;
    }
  }, [isActiveModelLoading, activeModel]);

  const handleUploadModel = () => {
    if (!hasPermission(Permission.MODEL_CREATE)) return;
    setIsUploadModalOpen(true);
  };

  const handleActivateModel = (model: ModelData) => {
    if (!hasPermission(Permission.MODEL_ACTIVATE)) return;
    activateModel(model.id);
    // al activar, permitir que se muestre nuevamente el aviso si vuelve a no haber activo
    notifiedNoActive.current = false;
  };


  

  const handleViewModel = (model: ModelData) => {
    setSelectedModel(model);
    setIsDetailModalOpen(true);
  };

  const handleModelUploadSuccess = () => {
    // Refrescar la lista de modelos y modelo activo después de subir uno nuevo
    fetchModels();
    fetchActiveModel();
    notifiedNoActive.current = false;
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modelo de IA</h1>
          <h2 className="text-3xl font-bold tracking-tight">
            Evaluación Automática de Transacciones
          </h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              fetchModels();
              fetchActiveModel();
              notifiedNoActive.current = false;
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          {hasPermission(Permission.MODEL_CREATE) && (
            <Button onClick={handleUploadModel} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Subir Dataset
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
                  Nuevo Dataset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado del Modelo Activo */}
      {isActiveModelLoading ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelo Activo
            </CardTitle>
            <CardDescription>Información del modelo de detección actualmente en uso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando modelo activo...</span>
            </div>
          </CardContent>
        </Card>
      ) : activeModel ? (
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
                <span className="text-sm text-gray-600 ml-2">
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
                <span className="text-sm text-gray-600 ml-2">{activeModel.uploadedBy}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamaño del Archivo</label>
                <span className="text-sm text-gray-600 ml-2">{activeModel.fileSize} MB</span>
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Recall</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${activeModel.recall || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{activeModel.recall?.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{activeModel.truePositives ?? 0}</div>
                <div className="text-xs text-gray-500">Verdaderos Positivos</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">{activeModel.falsePositives ?? 0}</div>
                <div className="text-xs text-gray-500">Falsos Positivos</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">{activeModel.falseNegatives ?? 0}</div>
                <div className="text-xs text-gray-500">Falsos Negativos</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{activeModel.trueNegatives ?? 0}</div>
                <div className="text-xs text-gray-500">Verdaderos Negativos</div>
              </div>
            </div>

          
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelo Activo
            </CardTitle>
            <CardDescription>Información del modelo de detección actualmente en uso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No hay modelo activo</p>
              <p className="text-sm">Activa un modelo desde el historial para comenzar</p>
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


      <ModelDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        model={selectedModel}
      />
    </div>
  );
}
