"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

const pieChartConfig = {
    Aprobadas: {
        label: "Aprobadas",
        color: "hsl(142, 76%, 36%)",
    },
    Fraudulentas: {
        label: "Fraudulentas",
        color: "hsl(0, 84%, 60%)",
    },
    Pendientes: {
        label: "Pendientes",
        color: "hsl(221, 83%, 53%)",
    },
} satisfies ChartConfig;

interface TransactionsDistributionChartProps {
    data: Array<{ status: string; count: number }>;
}

export function TransactionsDistributionChart({ data }: TransactionsDistributionChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribución de Transacciones</CardTitle>
                <CardDescription>Por estado de clasificación</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={pieChartConfig}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {data.map((entry, index) => {
                                const color = pieChartConfig[entry.status as keyof typeof pieChartConfig]?.color;
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

