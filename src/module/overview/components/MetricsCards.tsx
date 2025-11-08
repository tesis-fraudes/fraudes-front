"use client";

import { Activity, BarChart2, RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

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

const LABELS = {
    totalTransactions: {
        title: "Total evaluadas",
        description: "Registros analizados según filtros",
        icon: Activity,
        tone: "text-primary",
    },
    fraudDetected: {
        title: "Caso en alerta",
        description: "Marcadas como sospechosas / rechazadas",
        icon: ShieldAlert,
        tone: "text-destructive",
    },
    fraudRate: {
        title: "Tasa de alerta",
        description: "Porcentaje de operaciones en alarma",
        icon: BarChart2,
        tone: "text-primary",
    },
    accuracy: {
        title: "Cobertura restante",
        description: "Estimación de operaciones sin alerta",
        icon: ShieldCheck,
        tone: "text-emerald-600",
    },
    pendingReview: {
        title: "Pendientes manuales",
        description: "Requieren validación humana",
        icon: RefreshCcw,
        tone: "text-muted-foreground",
    },
};

export function MetricsCards({ metrics }: MetricsCardsProps) {
    const items = [
        {
            key: "totalTransactions" as const,
            value: metrics.totalTransactions.toLocaleString(),
        },
        {
            key: "fraudDetected" as const,
            value: metrics.fraudDetected.toLocaleString(),
        },
        {
            key: "fraudRate" as const,
            value: `${metrics.fraudRate.toFixed(2)}%`,
        },
        {
            key: "accuracy" as const,
            value: `${metrics.accuracy.toFixed(2)}%`,
        },
        {
            key: "pendingReview" as const,
            value: metrics.pendingReview.toLocaleString(),
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => {
                const config = LABELS[item.key];
                const Icon = config.icon;

                return (
                    <Card key={item.key} className="h-full border-border/60 shadow-sm">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-semibold tracking-tight">
                                    {config.title}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {config.description}
                                </CardDescription>
                            </div>
                            <span className="rounded-full bg-muted p-2 text-muted-foreground">
                                <Icon className="h-4 w-4" />
                            </span>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className={`text-2xl font-bold ${config.tone}`}>{item.value}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

