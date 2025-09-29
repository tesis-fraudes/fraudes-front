// MÓDULO: REPORTES
import { apiService } from "@/shared/services";

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  region?: string;
  fraudType?: string;
  riskLevel?: "low" | "medium" | "high";
  status?: string;
  merchant?: string;
}

export interface ReportData {
  id: string;
  title: string;
  type: "fraud_distribution" | "temporal_evolution" | "financial_analysis" | "geographic" | "custom";
  data: any;
  generatedAt: string;
  generatedBy: string;
  parameters: ReportFilters;
}

export interface FraudDistributionData {
  region: string;
  percentage: number;
  count: number;
  amount: number;
}

export interface TemporalEvolutionData {
  period: string;
  fraudCount: number;
  amount: number;
  trend: "up" | "down" | "stable";
}

export interface FinancialAnalysisData {
  totalDetected: number;
  averagePerCase: number;
  maximum: number;
  minimum: number;
  median: number;
  standardDeviation: number;
}

export interface GeographicData {
  country: string;
  region: string;
  fraudCount: number;
  amount: number;
  riskLevel: "low" | "medium" | "high";
}

export async function generateFraudDistributionReport(
  filters: ReportFilters = {}
): Promise<FraudDistributionData[]> {
  try {
    const response = await apiService.get("/reports/fraud-distribution", {
      params: filters,
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as FraudDistributionData[]) || [];
  } catch (error) {
    console.error("Error al generar reporte de distribución de fraudes:", error);
    throw error;
  }
}

// Nuevas funciones usando endpoints reales
export interface ApprovedTransaction {
  id: string;
  amount: number;
  merchant: string;
  customer_id: number;
  business_id: number;
  approved_at: string;
  approved_by: string;
  risk_score: number;
  transaction_date: string;
}

export interface RejectedTransaction {
  id: string;
  amount: number;
  merchant: string;
  customer_id: number;
  business_id: number;
  rejected_at: string;
  rejected_by: string;
  rejection_reason: string;
  risk_score: number;
  transaction_date: string;
}

export interface PredictedTransaction {
  id: string;
  amount: number;
  merchant: string;
  customer_id: number;
  business_id: number;
  prediction: number;
  risk_score: number;
  predicted_at: string;
  model_name: string;
  transaction_date: string;
}

export interface ReportQueryParams {
  start_date: string;
  end_date: string;
  limit?: number;
  offset?: number;
}

export async function getApprovedTransactions(
  params: ReportQueryParams
): Promise<{
  transactions: ApprovedTransaction[];
  total: number;
  limit: number;
  offset: number;
}> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/transactions/approveds",
      {
        params,
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data as {
      transactions: ApprovedTransaction[];
      total: number;
      limit: number;
      offset: number;
    };
  } catch (error) {
    console.error("Error al obtener transacciones aprobadas:", error);
    throw error;
  }
}

export async function getRejectedTransactions(
  params: ReportQueryParams
): Promise<{
  transactions: RejectedTransaction[];
  total: number;
  limit: number;
  offset: number;
}> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/transactions/rejecteds",
      {
        params,
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data as {
      transactions: RejectedTransaction[];
      total: number;
      limit: number;
      offset: number;
    };
  } catch (error) {
    console.error("Error al obtener transacciones rechazadas:", error);
    throw error;
  }
}

export async function getPredictedTransactions(
  params: ReportQueryParams
): Promise<{
  transactions: PredictedTransaction[];
  total: number;
  limit: number;
  offset: number;
}> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/predicted",
      {
        params,
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data as {
      transactions: PredictedTransaction[];
      total: number;
      limit: number;
      offset: number;
    };
  } catch (error) {
    console.error("Error al obtener transacciones predichas:", error);
    throw error;
  }
}

export async function exportApprovedTransactions(
  params: ReportQueryParams
): Promise<Blob> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/transactions/approveds/export",
      {
        params,
        responseType: "blob",
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    return response.data as Blob;
  } catch (error) {
    console.error("Error al exportar transacciones aprobadas:", error);
    throw error;
  }
}

export async function exportRejectedTransactions(
  params: ReportQueryParams
): Promise<Blob> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/transactions/rejecteds/export",
      {
        params,
        responseType: "blob",
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    return response.data as Blob;
  } catch (error) {
    console.error("Error al exportar transacciones rechazadas:", error);
    throw error;
  }
}

export async function exportPredictedTransactions(
  params: ReportQueryParams
): Promise<Blob> {
  try {
    const response = await apiService.get(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/report/predicted/export",
      {
        params,
        responseType: "blob",
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    return response.data as Blob;
  } catch (error) {
    console.error("Error al exportar transacciones predichas:", error);
    throw error;
  }
}

export async function generateTemporalEvolutionReport(
  filters: ReportFilters = {}
): Promise<TemporalEvolutionData[]> {
  try {
    const response = await apiService.get("/reports/temporal-evolution", {
      params: filters,
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as TemporalEvolutionData[]) || [];
  } catch (error) {
    console.error("Error al generar reporte de evolución temporal:", error);
    throw error;
  }
}

export async function generateFinancialAnalysisReport(
  filters: ReportFilters = {}
): Promise<FinancialAnalysisData> {
  try {
    const response = await apiService.get("/reports/financial-analysis", {
      params: filters,
      headers: {
        accept: "*/*",
      },
    });
    return response.data as FinancialAnalysisData;
  } catch (error) {
    console.error("Error al generar reporte de análisis financiero:", error);
    throw error;
  }
}

export async function generateGeographicReport(
  filters: ReportFilters = {}
): Promise<GeographicData[]> {
  try {
    const response = await apiService.get("/reports/geographic", {
      params: filters,
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as GeographicData[]) || [];
  } catch (error) {
    console.error("Error al generar reporte geográfico:", error);
    throw error;
  }
}

export async function exportReport(
  reportId: string,
  format: "pdf" | "excel" | "csv" = "pdf"
): Promise<Blob> {
  try {
    const response = await apiService.get(`/reports/${reportId}/export`, {
      params: { format },
      responseType: "blob",
      headers: {
        accept: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    return response.data as Blob;
  } catch (error) {
    console.error("Error al exportar reporte:", error);
    throw error;
  }
}

export async function getReportHistory(
  page: number = 1,
  limit: number = 10
): Promise<{
  reports: ReportData[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const response = await apiService.get("/reports/history", {
      params: { page, limit },
      headers: {
        accept: "*/*",
      },
    });

    const data = response.data as any;
    return {
      reports: data.reports || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  } catch (error) {
    console.error("Error al obtener historial de reportes:", error);
    throw error;
  }
}

export async function scheduleReport(
  reportType: string,
  filters: ReportFilters,
  schedule: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
    email?: string;
  }
): Promise<{ scheduleId: string }> {
  try {
    const response = await apiService.post(
      "/reports/schedule",
      { reportType, filters, schedule },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
    return response.data as { scheduleId: string };
  } catch (error) {
    console.error("Error al programar reporte:", error);
    throw error;
  }
}
