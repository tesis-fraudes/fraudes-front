"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
    fraud: {
        label: "Fraude",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface FraudsByRegionChartProps {
    data: Array<{ region: string; frauds: number; transactions?: number }>;
}

export function FraudsByRegionChart({ data }: FraudsByRegionChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fraudes por Región</CardTitle>
                <CardDescription>Tasa de fraude por región geográfica</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <XAxis dataKey="region" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="frauds" fill="var(--color-fraud)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

