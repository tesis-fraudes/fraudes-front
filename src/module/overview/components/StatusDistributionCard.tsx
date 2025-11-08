import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/ui/chart";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

interface StatusDistributionChartProps {
    data: Array<{ status: string; count: number }>;
    total: number;
}

const COLORS = [
    "hsl(221, 83%, 53%)",
    "hsl(142, 76%, 36%)",
    "hsl(0, 84%, 60%)",
    "hsl(271, 81%, 56%)",
    "hsl(23, 96%, 53%)",
    "hsl(200, 98%, 39%)",
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
                                className="h-[300px] sm:h-[360px] lg:h-[420px] max-w-full rounded-xl bg-muted/10 px-4 py-6"
                            >
                                <BarChart data={chartData} barCategoryGap="20%">
                                    <XAxis
                                        dataKey="status"
                                        tickLine={false}
                                        axisLine={false}
                                        height={60}
                                        tickFormatter={(value: string) =>
                                            value.length > 16 ? `${value.slice(0, 16)}…` : value
                                        }
                                        interval={0}
                                        angle={chartData.length > 4 ? -20 : 0}
                                        textAnchor={chartData.length > 4 ? "end" : "middle"}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tickLine={false}
                                        axisLine={false}
                                        width={48}
                                    />
                                    <ChartTooltip
                                        cursor={{ fill: "hsl(var(--accent) / 0.35)" }}
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
                                        wrapperStyle={{ paddingTop: 16 }}
                                        content={
                                            <ChartLegendContent
                                                className="flex-wrap gap-3 text-xs sm:text-sm"
                                                nameKey="status"
                                            />
                                        }
                                    />
                                    <Bar dataKey="count" radius={[10, 10, 4, 4]} maxBarSize={56}>
                                        {chartData.map((entry) => (
                                            <Cell key={entry.status} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
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

