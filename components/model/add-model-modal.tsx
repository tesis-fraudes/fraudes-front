"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File } from "lucide-react";
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
import { saveModel } from "@/services/model.service";
import { toast } from "sonner";

interface AddModelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddModelModal({ open, onOpenChange, onSuccess }: AddModelModalProps) {
  const [modelName, setModelName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv', ".txt"],
      'application/octet-stream': ['.pkl', '.joblib'],
      'application/x-python-code': ['.py']
    },
    multiple: false,
  });

  const handleSave = async () => {
    if (!modelName.trim() || !uploadedFile) {
      return;
    }

    setIsLoading(true);
    try {
      await saveModel({
        file: uploadedFile,
        modelo: modelName.trim(),
        version: "1",
        accuracy: "100%",
        status: "Activo"
      });
      toast.success("Modelo guardado exitosamente");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el modelo:", error);
      toast.error("Error al guardar el modelo. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setModelName("");
    setUploadedFile(null);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Modelo</DialogTitle>
          <DialogDescription>
            Sube un nuevo modelo de IA para la detección de fraudes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-name">Nombre del Modelo</Label>
            <Input
              id="model-name"
              placeholder="Ej: Modelo_Fraude_v2.1"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Archivo del Modelo</Label>
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
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
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
                      : "Arrastra y suelta el archivo aquí"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formatos soportados: .json, .csv, .pkl, .joblib, .py
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!modelName.trim() || !uploadedFile || isLoading}
            className="button-blue-primary"
          >
            {isLoading ? "Guardando..." : "Guardar Modelo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 