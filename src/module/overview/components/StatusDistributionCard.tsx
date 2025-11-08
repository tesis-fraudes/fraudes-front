import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface StatusDistributionChartProps {
    data: Array<{ status: string; count: number }>;
    total: number;
}

const COLORS = [
    "hsl(221, 100%, 86%)", // azul pastel
    "hsl(142, 72%, 82%)",  // verde pastel
    "hsl(353, 82%, 86%)",  // rojo pastel
    "hsl(271, 74%, 88%)",  // morado pastel
    "hsl(32, 100%, 85%)",  // naranja pastel
    "hsl(199, 85%, 84%)",  // celeste pastel
];

export function StatusDistributionChart({ data, total }: StatusDistributionChartProps) {
    const chartData = [...data]
        .sort((a, b) => b.count - a.count)
        .map((item, index) => {
            const normalizedStatus = item.status?.toUpperCase?.() ?? `ESTADO ${index + 1}`;
            const percentage = total > 0 ? Number(((item.count / total) * 100).toFixed(2)) : 0;

            return {
                status: normalizedStatus,
                count: item.count,
                percentage,
                color: COLORS[index % COLORS.length],
            };
        });

    const hasData = total > 0 && chartData.some((item) => item.count > 0);
    const config = chartData.reduce<Record<string, { label: string; color: string }>>(
        (acc, item) => {
            acc[item.status] = {
                label: item.status,
                color: item.color,
            };
            return acc;
        },
        {}
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
                <CardDescription>
                    Resumen de las transacciones según la clasificación de la API
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {hasData ? (
                    <>
                        <div className="grid gap-4 text-sm sm:grid-cols-3">
                            {chartData.map((item) => (
                                <div key={`summary-${item.status}`} className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div className="flex flex-col sm:flex-1">
                                        <span className="font-medium leading-tight">{item.status}</span>
                                        <span className="text-muted-foreground">
                                            {item.count.toLocaleString()} ({item.percentage}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full">
                            <ChartContainer
                                id="status-distribution"
                                config={config}
                                className="max-w-full rounded-xl bg-white px-4 py-6 shadow-sm ring-1 ring-muted/40"
                            >
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius="50%"
                                        outerRadius="72%"
                                        cornerRadius={12}
                                        paddingAngle={chartData.length > 1 ? 2 : 0}
                                    >
                                        {chartData.map((entry) => (
                                            <Cell
                                                key={entry.status}
                                                fill={entry.color}
                                                stroke="rgba(255,255,255,0.8)"
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                nameKey="status"
                                                formatter={(value, _name, item) => {
                                                    const percentage =
                                                        item?.payload?.percentage?.toFixed?.(2) ?? "0.00";
                                                    return [
                                                        `${Number(value).toLocaleString()} (${percentage}%)`,
                                                        "Cantidad",
                                                    ];
                                                }}
                                            />
                                        }
                                    />
                                    <ChartLegend
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: 16 }}
                                        content={
                                            <ChartLegendContent
                                                className="flex-wrap gap-3 text-xs sm:text-sm"
                                                nameKey="status"
                                            />
                                        }
                                    />
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        Aún no hay datos para mostrar la distribución por estado.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

