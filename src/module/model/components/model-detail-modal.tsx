import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar, X } from "lucide-react";

export interface ModelDetail {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  isActive: boolean;
  accuracy?: number;
  status: "active" | "inactive" | "training" | "error";
  urlFile?: string;
}

interface ModelDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: ModelDetail | null;
}

export function ModelDetailModal({ open, onOpenChange, model }: ModelDetailModalProps) {
  if (!model) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalle del Modelo</DialogTitle>
          <DialogDescription>Información completa del modelo seleccionado</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{model.name}</span>
            <Badge variant={model.isActive ? "default" : "secondary"}>
              {model.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {model.uploadedAt.toLocaleString("es-ES")}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <b>Versión:</b> {model.version}
            </div>
            <div>
              <b>Precisión:</b>{" "}
              {model.accuracy !== undefined ? `${model.accuracy.toFixed(1)}%` : "N/A"}
            </div>
            <div>
              <b>Subido por:</b> {model.uploadedBy}
            </div>
            <div>
              <b>Tamaño:</b> {model.fileSize ? `${(model.fileSize / 1024).toFixed(2)} MB` : "N/A"}
            </div>
            <div>
              <b>Estado:</b> {model.status}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1" /> Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
