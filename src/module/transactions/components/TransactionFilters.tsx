"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { TransactionFilters } from "../services";

interface TransactionFiltersProps {
  onFiltersChange: (filters: TransactionFilters) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  filters: TransactionFilters;
}

export default function TransactionFiltersComponent({
  onFiltersChange,
  onSearchChange,
  searchQuery,
  filters,
}: TransactionFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: keyof TransactionFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange("");
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Búsqueda principal */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID, comercio, tarjeta o cliente..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Botón de filtros */}
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          {/* Botón limpiar */}
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por estado */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estado
                </label>
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) => handleFilterChange("status", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="aprobada">Aprobada</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por tipo de fraude */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tipo de Fraude
                </label>
                <Select
                  value={filters.fraudType || ""}
                  onValueChange={(value) => handleFilterChange("fraudType", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    <SelectItem value="transaccion_inusual">Transacción Inusual</SelectItem>
                    <SelectItem value="monto_elevado">Monto Elevado</SelectItem>
                    <SelectItem value="ubicacion_sospechosa">Ubicación Sospechosa</SelectItem>
                    <SelectItem value="dispositivo_desconocido">Dispositivo Desconocido</SelectItem>
                    <SelectItem value="horario_atipico">Horario Atípico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por nivel de riesgo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nivel de Riesgo
                </label>
                <Select
                  value={filters.riskLevel || ""}
                  onValueChange={(value) => handleFilterChange("riskLevel", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los niveles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los niveles</SelectItem>
                    <SelectItem value="low">Bajo (0-59%)</SelectItem>
                    <SelectItem value="medium">Medio (60-79%)</SelectItem>
                    <SelectItem value="high">Alto (80-100%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por comercio */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Comercio
                </label>
                <Input
                  placeholder="Nombre del comercio"
                  value={filters.merchant || ""}
                  onChange={(e) => handleFilterChange("merchant", e.target.value || undefined)}
                />
              </div>
            </div>

            {/* Filtros de fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fecha Desde
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fecha Hasta
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
