"use client";

import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface Metrics {
    totalTransactions: number;
    fraudDetected: number;
    fraudRate: number;
    accuracy: number;
    pendingReview: number;
}

interface MetricsCardsProps {
    metrics: Metrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Últimos 30 días</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fraudes Detectados</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{metrics.fraudDetected}</div>
                    <p className="text-xs text-muted-foreground">
                        Tasa de fraude: {metrics.fraudRate}%
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Precisión del Modelo</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{metrics.accuracy}%</div>
                    <p className="text-xs text-muted-foreground">+2.3% desde el mes pasado</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendientes de Revisión</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.pendingReview}</div>
                    <p className="text-xs text-muted-foreground">Requieren atención manual</p>
                </CardContent>
            </Card>
        </div>
    );
}

