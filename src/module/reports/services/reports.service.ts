// MÓDULO: REPORTES
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";

// Tipos para transacciones aprobadas
export interface ApprovedTransaction {
  id: string;
  transaction_id: string;
  customer_name: string;
  business_name: string;
  amount: number;
  payment_method: string;
  created_at: string;
  approved_at: string;
  approved_by: string;
  risk_score: number;
  model_used: string;
  observation: string;
  consequences: string;
}

// Tipos para transacciones rechazadas
export interface RejectedTransaction {
  id: string;
  transaction_id: string;
  customer_name: string;
  business_name: string;
  amount: number;
  payment_method: string;
  created_at: string;
  rejected_at: string;
  rejected_by: string;
  risk_score: number;
  model_used: string;
  observation: string;
  consequences: string;
}

// Tipos para predicciones de modelos
export interface ModelPrediction {
  id: string;
  model_name: string;
  model_version: string;
  prediction_id: string;
  transaction_id: string;
  customer_name: string;
  business_name: string;
  amount: number;
  risk_score: number;
  prediction: "approved" | "rejected" | "flagged";
  confidence: number;
  created_at: string;
  processed_at: string;
}

// Parámetros de consulta
export interface ReportQueryParams {
  start_date: string;
  end_date: string;
  limit?: number;
  offset?: number;
}

// Respuesta de la API
export interface ReportResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Servicio para transacciones aprobadas
export async function getApprovedTransactions(
  params: ReportQueryParams
): Promise<ReportResponse<ApprovedTransaction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit || 50).toString(),
      offset: (params.offset || 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/approveds?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    const raw: any = response as any;
    const data: ApprovedTransaction[] = Array.isArray(raw)
      ? (raw as ApprovedTransaction[])
      : (raw?.data as ApprovedTransaction[]) || [];

    const normalized: ReportResponse<ApprovedTransaction> = {
      data,
      total: typeof raw?.total === "number" ? raw.total : data.length,
      limit: typeof raw?.limit === "number" ? raw.limit : (params.limit || 50),
      offset: typeof raw?.offset === "number" ? raw.offset : (params.offset || 0),
      has_more: typeof raw?.has_more === "boolean" ? raw.has_more : false,
    };

    return normalized;
  } catch (error) {
    throw error;
  }
}

export async function exportApprovedTransactions(
  params: Omit<ReportQueryParams, 'limit' | 'offset'>
): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/approveds/export?${queryParams}`,
      {
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      }
    );

    return response as unknown as Blob;
  } catch (error) {
    console.error("Error al exportar transacciones aprobadas:", error);
    throw error;
  }
}

// Servicio para transacciones rechazadas
export async function getRejectedTransactions(
  params: ReportQueryParams
): Promise<ReportResponse<RejectedTransaction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit || 50).toString(),
      offset: (params.offset || 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/rejecteds?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    const raw: any = response as any;
    const data: RejectedTransaction[] = Array.isArray(raw)
      ? (raw as RejectedTransaction[])
      : (raw?.data as RejectedTransaction[]) || [];

    const normalized: ReportResponse<RejectedTransaction> = {
      data,
      total: typeof raw?.total === "number" ? raw.total : data.length,
      limit: typeof raw?.limit === "number" ? raw.limit : (params.limit || 50),
      offset: typeof raw?.offset === "number" ? raw.offset : (params.offset || 0),
      has_more: typeof raw?.has_more === "boolean" ? raw.has_more : false,
    };

    return normalized;
  } catch (error) {
    throw error;
  }
}

export async function exportRejectedTransactions(
  params: Omit<ReportQueryParams, 'limit' | 'offset'>
): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/rejecteds/export?${queryParams}`,
      {
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      }
    );

    return response as unknown as Blob;
  } catch (error) {
    console.error("Error al exportar transacciones rechazadas:", error);
    throw error;
  }
}

// Servicio para predicciones de modelos
export async function getModelPredictions(
  params: ReportQueryParams
): Promise<ReportResponse<ModelPrediction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit || 50).toString(),
      offset: (params.offset || 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/predicted?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // Normalizar respuesta: puede venir como { data, total, ... } o como array plano
    const raw: any = response as any;
    const data: ModelPrediction[] = Array.isArray(raw)
      ? (raw as ModelPrediction[])
      : (raw?.data as ModelPrediction[]) || [];

    const normalized: ReportResponse<ModelPrediction> = {
      data,
      total: typeof raw?.total === "number" ? raw.total : data.length,
      limit: typeof raw?.limit === "number" ? raw.limit : (params.limit || 50),
      offset: typeof raw?.offset === "number" ? raw.offset : (params.offset || 0),
      has_more: typeof raw?.has_more === "boolean" ? raw.has_more : false,
    };

    return normalized;
  } catch (error) {
    throw error;
  }
}

export async function exportModelPredictions(
  params: Omit<ReportQueryParams, 'limit' | 'offset'>
): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/predicted/export?${queryParams}`,
      {
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      }
    );

    return response as unknown as Blob;
  } catch (error) {
    console.error("Error al exportar predicciones de modelos:", error);
    throw error;
  }
}