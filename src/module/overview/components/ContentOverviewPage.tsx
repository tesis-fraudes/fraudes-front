"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { OverviewFiltersComponent } from "./OverviewFilters";
import {
    TransactionsByDayChart,
    TransactionsDistributionChart,
    FraudsByTypeChart,
    FraudsByRegionChart,
    PredictionsTrendChart,
} from "./charts";
import { MetricsCards } from "./MetricsCards";
import { useOverviewStore } from "../store/overview.store";
import { exportOverviewToPdf } from "../utils/exportToPdf";

export default function ContentOverviewPage() {
    const {
        data,
        isLoading,
        error,
        filters,
        setFilters,
        generateOverview,
        clearData,
        clearError,
    } = useOverviewStore();

    // Limpiar error después de 5 segundos
    useEffect(() => {
        if (error) {
            toast.error(error);
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleGenerateOverview = async () => {
        try {
            await generateOverview();
            toast.success("Overview generado correctamente");
        } catch {
            toast.error("Error al generar el overview");
        }
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            businessId: null,
            startDate: null,
            endDate: null,
        };
        setFilters(emptyFilters);
        clearData();
        toast.info("Filtros limpiados");
    };

    const handleExportPdf = async () => {
        if (!data) {
            toast.error("Debe generar el overview primero");
            return;
        }

        try {
            await exportOverviewToPdf("overview-charts", `overview-reporte-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF generado correctamente");
        } catch (error) {
            toast.error("Error al generar el PDF");
            console.error("Error al exportar PDF:", error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview - Reportes de Fraudes</h1>
                    <p className="text-muted-foreground">
                        Vista general del sistema de detección de fraudes
                    </p>
                </div>
                {data && (
                    <Button onClick={handleExportPdf} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>
                )}
            </div>

            {/* Filtros */}
            <OverviewFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onGenerateOverview={handleGenerateOverview}
                onClearFilters={handleClearFilters}
                isLoading={isLoading}
            />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {isLoading && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Generando overview...</p>
                </div>
            )}

            {data && !isLoading && (
                <>
                    {/* Métricas principales */}
                    <MetricsCards metrics={data.metrics} />

                    {/* Sección de gráficos para PDF */}
                    <div id="overview-charts" className="space-y-6">
                        {/* Gráficos principales */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <TransactionsByDayChart data={data.transactionsByDay} />
                            <TransactionsDistributionChart data={data.transactionsByStatus} />
                        </div>

                        {/* Gráficos adicionales de fraudes */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <FraudsByTypeChart data={data.fraudsByType} />
                            <FraudsByRegionChart data={data.fraudsByRegion} />
                        </div>

                        {/* Gráfico de tendencia de predicciones */}
                        <PredictionsTrendChart data={data.predictionsTrend} />
                    </div>
                </>
            )}

            {!data && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        Seleccione los filtros y haga clic en "Generar Overview" para ver los datos
                    </p>
                </div>
            )}
        </div>
    );
}
