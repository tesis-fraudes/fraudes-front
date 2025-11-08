// MÓDULO: REPORTES
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";
import { buildExcelBlob } from "../utils/excelExport";

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

const DEFAULT_LIMIT = 50;

function extractItems<T>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw?.data?.items)) return raw.data.items;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.results)) return raw.results;
  if (Array.isArray(raw?.records)) return raw.records;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw)) return raw;
  return [];
}

function extractMeta(raw: any) {
  if (raw?.data?.meta && typeof raw.data.meta === "object") {
    return raw.data.meta;
  }
  if (raw?.meta && typeof raw.meta === "object") {
    return raw.meta;
  }
  if (raw?.data?.pagination && typeof raw.data.pagination === "object") {
    return raw.data.pagination;
  }
  if (raw?.pagination && typeof raw.pagination === "object") {
    return raw.pagination;
  }
  return {};
}

function normalizeReportResponse<T>(
  raw: any,
  params: ReportQueryParams,
): ReportResponse<T> {
  const items = extractItems<T>(raw);
  const meta = extractMeta(raw);

  const limit = Number(meta.limit ?? params.limit ?? DEFAULT_LIMIT);
  const offset = Number(meta.offset ?? params.offset ?? 0);
  const total = Number(meta.total ?? raw?.total ?? items.length);
  const hasMore =
    typeof meta.has_more === "boolean"
      ? meta.has_more
      : items.length >= limit || Boolean(meta.next_cursor || meta.next_offset);

  return {
    data: items,
    total,
    limit,
    offset,
    has_more: hasMore,
  };
}

async function exportReportToExcel<T>(
  url: string,
  params: Omit<ReportQueryParams, "limit" | "offset">,
  sheetName: string,
  headerMap?: Record<string, string>,
): Promise<Blob> {
  const queryParams = new URLSearchParams({
    start_date: params.start_date,
    end_date: params.end_date,
  });

  const response = await apiService.get(
    `${url}?${queryParams}`,
    {
      headers: {
        accept: "*/*",
      },
    },
  );

  const raw: any = response as any;
  const items = extractItems<T>(raw);

  return buildExcelBlob({
    data: (items as Array<Record<string, unknown>>) ?? [],
    sheetName,
    headerMap,
  });
}

// Servicio para transacciones aprobadas
export async function getApprovedTransactions(
  params: ReportQueryParams,
): Promise<ReportResponse<ApprovedTransaction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit ?? DEFAULT_LIMIT).toString(),
      offset: (params.offset ?? 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/approveds?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      },
    );

    return normalizeReportResponse<ApprovedTransaction>(
      response,
      params,
    );
  } catch (error) {
    throw error;
  }
}

export async function exportApprovedTransactions(
  params: Omit<ReportQueryParams, "limit" | "offset">,
): Promise<Blob> {
  try {
    return await exportReportToExcel<ApprovedTransaction>(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/approveds/export`,
      params,
      "Transacciones Aprobadas",
    );
  } catch (error) {
    console.error("Error al exportar transacciones aprobadas:", error);
    throw error;
  }
}

// Servicio para transacciones rechazadas
export async function getRejectedTransactions(
  params: ReportQueryParams,
): Promise<ReportResponse<RejectedTransaction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit ?? DEFAULT_LIMIT).toString(),
      offset: (params.offset ?? 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/rejecteds?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      },
    );

    return normalizeReportResponse<RejectedTransaction>(response, params);
  } catch (error) {
    throw error;
  }
}

export async function exportRejectedTransactions(
  params: Omit<ReportQueryParams, "limit" | "offset">,
): Promise<Blob> {
  try {
    return await exportReportToExcel<RejectedTransaction>(
      `${ENV.API_URL_TRANSACTIONS}/report/transactions/rejecteds/export`,
      params,
      "Transacciones Rechazadas",
    );
  } catch (error) {
    console.error("Error al exportar transacciones rechazadas:", error);
    throw error;
  }
}

// Servicio para predicciones de modelos
export async function getModelPredictions(
  params: ReportQueryParams,
): Promise<ReportResponse<ModelPrediction>> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      limit: (params.limit ?? DEFAULT_LIMIT).toString(),
      offset: (params.offset ?? 0).toString(),
    });

    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/report/predicted?${queryParams}`,
      {
        headers: {
          accept: "*/*",
        },
      },
    );

    return normalizeReportResponse<ModelPrediction>(response, params);
  } catch (error) {
    throw error;
  }
}

export async function exportModelPredictions(
  params: Omit<ReportQueryParams, "limit" | "offset">,
): Promise<Blob> {
  try {
    return await exportReportToExcel<ModelPrediction>(
      `${ENV.API_URL_TRANSACTIONS}/report/predicted/export`,
      params,
      "Predicciones",
    );
  } catch (error) {
    console.error("Error al exportar predicciones de modelos:", error);
    throw error;
  }
}