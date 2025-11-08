import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services/api.service";

export interface OverviewMetrics {
    totalTransactions: number;
    fraudDetected: number;
    fraudRate: number;
    accuracy: number;
    pendingReview: number;
}

export interface TransactionDayData {
    day: string;
    transactions: number;
    fraud: number;
}

export interface TransactionStatusData {
    status: string;
    count: number;
}

export interface FraudTypeData {
    type: string;
    count: number;
}

export interface FraudRegionData {
    region: string;
    frauds: number;
    transactions: number;
}

export interface PredictionTrendData {
    month: string;
    predictions: number;
    accuracy: number;
}

export interface OverviewData {
    metrics: OverviewMetrics;
    transactionsByDay: TransactionDayData[];
    transactionsByStatus: TransactionStatusData[];
    fraudsByType: FraudTypeData[];
    fraudsByRegion: FraudRegionData[];
    predictionsTrend: PredictionTrendData[];
}

export interface OverviewFilters {
    businessId: number | null;
    startDate: Date | null;
    endDate: Date | null;
}

interface ApiOverviewStatus {
    status: number;
    label: string;
    count: string;
}

function resolveResponsePayload(response: unknown): ApiOverviewStatus[] {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && typeof response === "object" && Array.isArray((response as any).data)) {
        return (response as any).data;
    }

    return [];
}

function mapStatusesToOverview(statuses: ApiOverviewStatus[]): OverviewData {
    const parsed = statuses.map((item) => ({
        ...item,
        count: Number(item.count) || 0,
    }));

    const aggregated = parsed.reduce(
        (acc, item) => {
            const label = item.label.toUpperCase();

            if (label.includes("APROBADO")) {
                acc.approved += item.count;
            } else if (label.includes("RECHAZADA") || label.includes("SOSPECHOSA")) {
                acc.fraudulent += item.count;
            } else if (label.includes("PENDIENTE")) {
                acc.pending += item.count;
            } else {
                acc.others += item.count;
            }

            acc.total += item.count;
            return acc;
        },
        {
            approved: 0,
            fraudulent: 0,
            pending: 0,
            others: 0,
            total: 0,
        }
    );

    const totalTransactions = aggregated.total;
    const fraudDetected = aggregated.fraudulent;
    const pendingReview = aggregated.pending;
    const fraudRate =
        totalTransactions > 0
            ? Number(((fraudDetected / totalTransactions) * 100).toFixed(2))
            : 0;
    const accuracy =
        totalTransactions > 0
            ? Number(
                  (((totalTransactions - fraudDetected) / totalTransactions) * 100).toFixed(2)
              )
            : 0;

    const statusDistribution = parsed.map((item) => ({
        status: item.label,
        count: item.count,
    }));

    return {
        metrics: {
            totalTransactions,
            fraudDetected,
            fraudRate,
            accuracy,
            pendingReview,
        },
        transactionsByDay: [],
        transactionsByStatus: statusDistribution,
        fraudsByType: [],
        fraudsByRegion: [],
        predictionsTrend: [],
    };
}

/**
 * Obtiene los datos del overview con filtros
 */
export async function getOverviewData(filters: OverviewFilters): Promise<OverviewData> {
    try {
        const params = new URLSearchParams();

        if (filters.businessId) {
            params.append("business_id", filters.businessId.toString());
        }

        if (filters.startDate) {
            params.append("start_date", filters.startDate.toISOString().split("T")[0]);
        }

        if (filters.endDate) {
            params.append("end_date", filters.endDate.toISOString().split("T")[0]);
        }

        const queryString = params.toString();
        const url = `${ENV.API_URL_TRANSACTIONS}/report/overview${queryString ? `?${queryString}` : ""}`;

        const response = await apiService.get<ApiOverviewStatus[]>(url, {
            headers: {
                accept: "*/*",
            },
        });

        const payload = resolveResponsePayload(response);

        if (!Array.isArray(payload) || payload.length === 0) {
            return mapStatusesToOverview([]);
        }

        return mapStatusesToOverview(payload);
    } catch (error) {
        console.error("Error al obtener datos del overview:", error);
        throw error;
    }
}

