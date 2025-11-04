"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { DatePicker } from "@/shared/ui/date-picker";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { getBusinessList, type Business } from "@/shared/services/business.service";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";

export interface OverviewFilters {
    businessId: number | null;
    startDate: Date | null;
    endDate: Date | null;
}

interface OverviewFiltersProps {
    filters: OverviewFilters;
    onFiltersChange: (filters: OverviewFilters) => void;
    onGenerateOverview: () => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

export function OverviewFiltersComponent({
    filters,
    onFiltersChange,
    onGenerateOverview,
    onClearFilters,
    isLoading = false,
}: OverviewFiltersProps) {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBusinesses() {
            try {
                const data = await getBusinessList();
                setBusinesses(data);
            } catch (error) {
                console.error("Error al cargar comercios:", error);
            } finally {
                setLoading(false);
            }
        }

        loadBusinesses();
    }, []);

    const hasFilters = filters.businessId !== null || filters.startDate !== null || filters.endDate !== null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Combo de Comercio */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Comercio</Label>
                        <Select
                            value={filters.businessId?.toString() || "all"}
                            onValueChange={(value) => {
                                onFiltersChange({
                                    ...filters,
                                    businessId: value === "all" ? null : Number(value),
                                });
                            }}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos los comercios" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los comercios</SelectItem>
                                {businesses.map((business) => (
                                    <SelectItem key={business.id} value={business.id.toString()}>
                                        {business.name || business.tradeName || `Comercio ${business.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Fecha Inicio */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Fecha Inicio</Label>
                        <DatePicker
                            value={filters.startDate || undefined}
                            onChange={(date) => {
                                onFiltersChange({
                                    ...filters,
                                    startDate: date || null,
                                });
                            }}
                            placeholder="Seleccionar fecha inicio"
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Fecha Fin</Label>
                        <DatePicker
                            value={filters.endDate || undefined}
                            onChange={(date) => {
                                onFiltersChange({
                                    ...filters,
                                    endDate: date || null,
                                });
                            }}
                            placeholder="Seleccionar fecha fin"
                        />
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 mt-4">
                    <Button 
                        onClick={onGenerateOverview} 
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {isLoading ? "Generando..." : "Generar Overview"}
                    </Button>
                    {hasFilters && (
                        <Button
                            variant="outline"
                            onClick={onClearFilters}
                            className="flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                            Limpiar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

