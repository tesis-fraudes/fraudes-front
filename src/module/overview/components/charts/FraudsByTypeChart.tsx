"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/ui/chart";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

const fraudTypeConfig = {
    "Tarjeta Clonada": {
        label: "Tarjeta Clonada",
        color: "hsl(0, 84%, 60%)",
    },
    "Identidad Robada": {
        label: "Identidad Robada",
        color: "hsl(30, 84%, 60%)",
    },
    "Compra No Autorizada": {
        label: "Compra No Autorizada",
        color: "hsl(60, 84%, 60%)",
    },
    "Chargeback": {
        label: "Chargeback",
        color: "hsl(120, 84%, 60%)",
    },
} satisfies ChartConfig;

interface FraudsByTypeChartProps {
    data: Array<{ type: string; count: number }>;
}

export function FraudsByTypeChart({ data }: FraudsByTypeChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fraudes por Tipo</CardTitle>
                <CardDescription>Distribución de tipos de fraude detectados</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={fraudTypeConfig}>
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" width={150} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count">
                            {data.map((entry, index) => {
                                const color = fraudTypeConfig[entry.type as keyof typeof fraudTypeConfig]?.color;
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

