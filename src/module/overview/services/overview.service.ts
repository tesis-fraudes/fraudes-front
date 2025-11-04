// import { ENV } from "@/shared/const/env";
// import { apiService } from "@/shared/services/api.service";

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

/**
 * Obtiene los datos del overview con filtros
 */
export async function getOverviewData(filters: OverviewFilters): Promise<OverviewData> {
    try {
        // Construir query params
        const params = new URLSearchParams();
        
        if (filters.businessId) {
            params.append("business_id", filters.businessId.toString());
        }
        
        if (filters.startDate) {
            params.append("start_date", filters.startDate.toISOString().split('T')[0]);
        }
        
        if (filters.endDate) {
            params.append("end_date", filters.endDate.toISOString().split('T')[0]);
        }

        // const queryString = params.toString();
        // const url = `${ENV.API_URL_TRANSACTIONS}/reports/overview${queryString ? `?${queryString}` : ''}`;

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulación de datos (en producción esto vendrá de la API)
        const mockData: OverviewData = {
            metrics: {
                totalTransactions: 10257 + Math.floor(Math.random() * 1000),
                fraudDetected: 369 + Math.floor(Math.random() * 50),
                fraudRate: 3.6 + Math.random() * 0.5,
                accuracy: 96.5 + Math.random() * 1,
                pendingReview: 234 + Math.floor(Math.random() * 30),
            },
            transactionsByDay: [
                { day: "Lun", transactions: 1240 + Math.floor(Math.random() * 200), fraud: 45 + Math.floor(Math.random() * 10) },
                { day: "Mar", transactions: 1890 + Math.floor(Math.random() * 200), fraud: 52 + Math.floor(Math.random() * 10) },
                { day: "Mié", transactions: 1567 + Math.floor(Math.random() * 200), fraud: 38 + Math.floor(Math.random() * 10) },
                { day: "Jue", transactions: 2134 + Math.floor(Math.random() * 200), fraud: 67 + Math.floor(Math.random() * 10) },
                { day: "Vie", transactions: 2456 + Math.floor(Math.random() * 200), fraud: 89 + Math.floor(Math.random() * 10) },
                { day: "Sáb", transactions: 1789 + Math.floor(Math.random() * 200), fraud: 43 + Math.floor(Math.random() * 10) },
                { day: "Dom", transactions: 1323 + Math.floor(Math.random() * 200), fraud: 35 + Math.floor(Math.random() * 10) },
            ],
            transactionsByStatus: [
                { status: "Aprobadas", count: 8456 + Math.floor(Math.random() * 500) },
                { status: "Fraudulentas", count: 1234 + Math.floor(Math.random() * 200) },
                { status: "Pendientes", count: 567 + Math.floor(Math.random() * 100) },
            ],
            fraudsByType: [
                { type: "Tarjeta Clonada", count: 456 + Math.floor(Math.random() * 50) },
                { type: "Identidad Robada", count: 312 + Math.floor(Math.random() * 50) },
                { type: "Compra No Autorizada", count: 287 + Math.floor(Math.random() * 50) },
                { type: "Chargeback", count: 179 + Math.floor(Math.random() * 30) },
            ],
            fraudsByRegion: [
                { region: "Norte", frauds: 234 + Math.floor(Math.random() * 30), transactions: 3456 + Math.floor(Math.random() * 300) },
                { region: "Sur", frauds: 189 + Math.floor(Math.random() * 30), transactions: 2890 + Math.floor(Math.random() * 300) },
                { region: "Este", frauds: 156 + Math.floor(Math.random() * 30), transactions: 2345 + Math.floor(Math.random() * 300) },
                { region: "Oeste", frauds: 143 + Math.floor(Math.random() * 30), transactions: 2566 + Math.floor(Math.random() * 300) },
            ],
            predictionsTrend: [
                { month: "Ene", predictions: 4234 + Math.floor(Math.random() * 200), accuracy: 94.2 + Math.random() * 2 },
                { month: "Feb", predictions: 4567 + Math.floor(Math.random() * 200), accuracy: 95.1 + Math.random() * 2 },
                { month: "Mar", predictions: 4890 + Math.floor(Math.random() * 200), accuracy: 96.3 + Math.random() * 2 },
                { month: "Abr", predictions: 5123 + Math.floor(Math.random() * 200), accuracy: 95.8 + Math.random() * 2 },
                { month: "May", predictions: 5345 + Math.floor(Math.random() * 200), accuracy: 97.2 + Math.random() * 2 },
                { month: "Jun", predictions: 5678 + Math.floor(Math.random() * 200), accuracy: 96.9 + Math.random() * 2 },
            ],
        };

        // En producción, descomentar esto:
        // const response = await apiService.get<OverviewData>(url, {
        //     headers: {
        //         accept: "*/*",
        //     },
        // });
        // return response.data;

        return mockData;
    } catch (error) {
        console.error("Error al obtener datos del overview:", error);
        throw error;
    }
}

