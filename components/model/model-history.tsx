"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
} from "lucide-react";

interface ModelHistoryItem {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  isActive: boolean;
  accuracy?: number;
  status: "active" | "inactive" | "training" | "error";
}

interface ModelHistoryProps {
  models: ModelHistoryItem[];
  onViewModel: (model: ModelHistoryItem) => void;
  onActivateModel: (model: ModelHistoryItem) => void;
}

export function ModelHistory({
  models,
  onViewModel,
  onActivateModel,
}: ModelHistoryProps) {
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedModels = [...models].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (status: ModelHistoryItem["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Activo
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Inactivo
          </Badge>
        );
      case "training":
        return (
          <Badge
            variant="outline"
            className="border-blue-600 text-blue-600 bg-blue-50"
          >
            Entrenando
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="card-blue-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Historial de Modelos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {models.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No hay modelos subidos aún</p>
            <p className="text-sm">Sube tu primer modelo para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filtros y ordenamiento */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "name" | "status")
                  }
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="date">Fecha</option>
                  <option value="name">Nombre</option>
                  <option value="status">Estado</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {models.length} modelo{models.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Tabla de modelos */}
            <div className="border border-gray-200 rounded-lg overflow-hidden blue-shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Subido por</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Precisión</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-500">
                            v{model.version}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`/avatars/${model.uploadedBy.toLowerCase()}.jpg`}
                            />
                            <AvatarFallback className="text-xs">
                              {model.uploadedBy
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{model.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(model.uploadedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatFileSize(model.fileSize)}
                      </TableCell>
                      <TableCell>{getStatusBadge(model.status)}</TableCell>
                      <TableCell>
                        {model.accuracy ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {model.accuracy.toFixed(1)}%
                            </span>
                            {model.accuracy >= 90 ? (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            ) : model.accuracy < 70 ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-yellow-100 border border-yellow-300" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewModel(model)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        
                          {!model.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onActivateModel(model)}
                              title="Activar modelo"
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                         
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
