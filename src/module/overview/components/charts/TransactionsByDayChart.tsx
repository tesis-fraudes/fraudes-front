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
    transactions: {
        label: "Transacciones",
        color: "hsl(var(--chart-1))",
    },
    fraud: {
        label: "Fraude",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface TransactionsByDayChartProps {
    data: Array<{ day: string; transactions: number; fraud: number }>;
}

export function TransactionsByDayChart({ data }: TransactionsByDayChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transacciones por Día</CardTitle>
                <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="transactions" fill="var(--color-transactions)" />
                        <Bar dataKey="fraud" fill="var(--color-fraud)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

