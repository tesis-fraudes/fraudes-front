"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
    transactions: {
        label: "Transacciones",
        color: "hsl(var(--chart-1))",
    },
    approved: {
        label: "Aprobadas",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

interface PredictionsTrendChartProps {
    data: Array<{ month: string; predictions: number; accuracy: number }>;
}

export function PredictionsTrendChart({ data }: PredictionsTrendChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tendencia de Predicciones</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={data}>
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="predictions"
                            stroke="var(--color-transactions)"
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="accuracy"
                            stroke="var(--color-approved)"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

