"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File, Settings, Brain, RefreshCw, Trash2, Eye, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuthStore } from "@/lib/auth-store";

interface ModelConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DatasetHistoryItem {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  status: 'active' | 'inactive' | 'processing' | 'error';
  records: number;
  accuracy?: number;
}

interface ModelParameters {
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationSplit: number;
  earlyStopping: boolean;
  dropoutRate: number;
}

// Datos simulados para el historial de datasets
const mockDatasets: DatasetHistoryItem[] = [
  {
    id: "1",
    name: "Dataset_Fraude_2024_v1.csv",
    uploadedBy: "Ana García",
    uploadedAt: new Date("2024-01-15T09:30:00"),
    fileSize: 45.2 * 1024 * 1024, // 45.2 MB
    status: 'active',
    records: 125000,
    accuracy: 94.2,
  },
  {
    id: "2",
    name: "Dataset_Fraude_2023_v2.csv",
    uploadedBy: "Carlos López",
    uploadedAt: new Date("2024-01-10T14:20:00"),
    fileSize: 38.7 * 1024 * 1024, // 38.7 MB
    status: 'inactive',
    records: 98000,
    accuracy: 91.8,
  },
  {
    id: "3",
    name: "Dataset_Fraude_2023_v1.csv",
    uploadedBy: "María Rodríguez",
    uploadedAt: new Date("2024-01-05T11:15:00"),
    fileSize: 32.1 * 1024 * 1024, // 32.1 MB
    status: 'inactive',
    records: 85000,
    accuracy: 89.3,
  },
  {
    id: "4",
    name: "Dataset_Fraude_2024_v2_Beta.csv",
    uploadedBy: "Juan Pérez",
    uploadedAt: new Date("2024-01-20T16:45:00"),
    fileSize: 52.8 * 1024 * 1024, // 52.8 MB
    status: 'processing',
    records: 0,
    accuracy: undefined,
  },
];

export function ModelConfigModal({ open, onOpenChange }: ModelConfigModalProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("datasets");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [datasets, setDatasets] = useState<DatasetHistoryItem[]>(mockDatasets);
  
  // Parámetros del modelo
  const [modelParams, setModelParams] = useState<ModelParameters>({
    learningRate: 0.001,
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
    earlyStopping: true,
    dropoutRate: 0.3,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
    },
    multiple: false,
  });

  const handleUploadDataset = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // Simular subida
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDataset: DatasetHistoryItem = {
        id: Date.now().toString(),
        name: uploadedFile.name,
        uploadedBy: user?.name || "Usuario",
        uploadedAt: new Date(),
        fileSize: uploadedFile.size,
        status: 'processing',
        records: 0,
        accuracy: undefined,
      };
      
      setDatasets(prev => [newDataset, ...prev]);
      setUploadedFile(null);
    } catch (error) {
      console.error("Error al subir dataset:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDataset = (dataset: DatasetHistoryItem) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el dataset "${dataset.name}"?`)) {
      setDatasets(prev => prev.filter(d => d.id !== dataset.id));
    }
  };

  const handleActivateDataset = (dataset: DatasetHistoryItem) => {
    setDatasets(prev => prev.map(d => ({
      ...d,
      status: d.id === dataset.id ? 'active' : 'inactive'
    })));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: DatasetHistoryItem['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Activo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactivo</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-600 text-blue-600 bg-blue-50">Procesando</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
         <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Modelo
          </DialogTitle>
          <DialogDescription>
            Gestiona datasets de entrenamiento y configura parámetros del modelo
          </DialogDescription>
        </DialogHeader>
        
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 modal-scroll-container">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="parameters">Parámetros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datasets" className="space-y-4 mt-4 flex-1 flex flex-col min-h-0">
            {/* Subida de archivos */}
            <div className="space-y-4">
              <Label>Subir Nuevo Dataset</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-600 hover:bg-blue-50/30"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <File className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-600">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cambiar archivo
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isDragActive
                        ? "Suelta el archivo aquí"
                        : "Arrastra y suelta el dataset aquí"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Formatos soportados: .csv, .json, .xls, .xlsx
                    </p>
                  </div>
                )}
              </div>
              
              {uploadedFile && (
                <Button 
                  onClick={handleUploadDataset} 
                  disabled={isUploading}
                  className="w-full button-blue-primary"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Dataset
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Historial de datasets */}
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <Label>Historial de Datasets</Label>
              <div className="border rounded-lg overflow-hidden flex-1 min-h-0">
                <div className="modal-scroll-content max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dataset</TableHead>
                      <TableHead>Subido por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Registros</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell>
                          <div className="font-medium">{dataset.name}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {dataset.uploadedBy}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(dataset.uploadedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatFileSize(dataset.fileSize)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {dataset.records.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(dataset.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Descargar"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {dataset.status !== 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleActivateDataset(dataset)}
                                title="Activar dataset"
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Brain className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDataset(dataset)}
                              title="Eliminar"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                                     </TableBody>
                 </Table>
                 </div>
               </div>
             </div>
          </TabsContent>
          
          <TabsContent value="parameters" className="space-y-4 mt-4 flex-1 modal-scroll-content">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <Input
                  id="learning-rate"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  max="1"
                  value={modelParams.learningRate}
                  onChange={(e) => setModelParams(prev => ({
                    ...prev,
                    learningRate: parseFloat(e.target.value)
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epochs">Épocas</Label>
                <Input
                  id="epochs"
                  type="number"
                  min="1"
                  max="1000"
                  value={modelParams.epochs}
                  onChange={(e) => setModelParams(prev => ({
                    ...prev,
                    epochs: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  type="number"
                  min="1"
                  max="512"
                  value={modelParams.batchSize}
                  onChange={(e) => setModelParams(prev => ({
                    ...prev,
                    batchSize: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validation-split">Validación Split</Label>
                <Input
                  id="validation-split"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="0.5"
                  value={modelParams.validationSplit}
                  onChange={(e) => setModelParams(prev => ({
                    ...prev,
                    validationSplit: parseFloat(e.target.value)
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dropout-rate">Dropout Rate</Label>
                <Input
                  id="dropout-rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="0.9"
                  value={modelParams.dropoutRate}
                  onChange={(e) => setModelParams(prev => ({
                    ...prev,
                    dropoutRate: parseFloat(e.target.value)
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={modelParams.earlyStopping}
                    onChange={(e) => setModelParams(prev => ({
                      ...prev,
                      earlyStopping: e.target.checked
                    }))}
                    className="rounded"
                  />
                  Early Stopping
                </Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              console.log("Parámetros guardados:", modelParams);
              onOpenChange(false);
            }}
            className="button-blue-primary"
          >
            Guardar Configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 