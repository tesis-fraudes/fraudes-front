// MÓDULO: REPORTES
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";

// Tipos para transacciones aprobadas
export interface ApprovedTransaction {
  transaction_id: number;
  created_at: string;
  amount: number;
  currency: string;
  fraud_score: number;
  status: number;
  business_id: number;
  company_name: string;
  trade_name: string;
  customer_id: number;
  customer_name: string;
  payment_id: number;
  type_payment: string;
  provider: string;
  model_id: number;
  model_name: string;
}

// Tipos para transacciones rechazadas
export interface RejectedTransaction {
  transaction_id: number;
  created_at: string;
  amount: number;
  currency: string;
  fraud_score: number;
  status: number;
  business_id: number;
  company_name: string;
  trade_name: string;
  customer_id: number;
  customer_name: string;
  payment_id: number;
  type_payment: string;
  provider: string;
  model_id: number;
  model_name: string;
}

// Tipos para predicciones de modelos
export interface ModelPrediction {
  prediction_id: number;
  created_at: string;
  fraud_score: number;
  class: string;
  prediction: number;
  fraud_probability: number;
  model_id: number;
  model_name: string;
  transaction_id: number;
  amount: number;
  currency: string;
  transaction_fraud_score: number;
  business_id: number;
  company_name: string;
  trade_name: string;
  customer_id: number;
  customer_name: string;
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

    // La API devuelve { items: [...], meta: { limit, offset } }
    const raw: any = response as any;
    const items = raw?.items || raw?.data || (Array.isArray(raw) ? raw : []);
    const meta = raw?.meta || {};

    const normalized: ReportResponse<ApprovedTransaction> = {
      data: items,
      total: items.length,
      limit: meta.limit || (params.limit || 50),
      offset: meta.offset || (params.offset || 0),
      has_more: items.length >= (meta.limit || params.limit || 50),
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

    // La API devuelve { items: [...], meta: { limit, offset } }
    const raw: any = response as any;
    const items = raw?.items || raw?.data || (Array.isArray(raw) ? raw : []);
    const meta = raw?.meta || {};

    const normalized: ReportResponse<RejectedTransaction> = {
      data: items,
      total: items.length,
      limit: meta.limit || (params.limit || 50),
      offset: meta.offset || (params.offset || 0),
      has_more: items.length >= (meta.limit || params.limit || 50),
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

    // La API devuelve { items: [...], meta: { limit, offset } }
    const raw: any = response as any;
    const items = raw?.items || raw?.data || (Array.isArray(raw) ? raw : []);
    const meta = raw?.meta || {};

    const normalized: ReportResponse<ModelPrediction> = {
      data: items,
      total: items.length,
      limit: meta.limit || (params.limit || 50),
      offset: meta.offset || (params.offset || 0),
      has_more: items.length >= (meta.limit || params.limit || 50),
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