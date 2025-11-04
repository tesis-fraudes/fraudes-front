// MÓDULO: SIMULADOR DE COMPRA (Combos y selección)
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";
import type { ApiError } from "@/shared/services/api.service";

export interface SimulationConfig {
  endpointUrl: string;
  httpMethod: string;
  headers: Record<string, string>;
  modelName: string;
}

export interface PurchaseTransactionPayload {
  business_id: number;
  customer_id: number;
  payment_id: number;
  user_id: number;
  transaction_amount: number;
  transaction_hour: number;
  is_proxy: boolean;
  distance_home_shipping: number;
  avg_monthly_spend: number;
  previous_frauds: number;
  device_type: string;
  browser: string;
  country_ip: string;
  card_type: string;
  payment_method: string;
  card_country: string;
  business_country: string;
}

export interface SimulationResponse {
  prediction: number;
  risk_score: number;
  recommendation: string;
  timestamp: string;
}

export async function simulateTransaction(
  config: SimulationConfig,
  payload: PurchaseTransactionPayload
): Promise<SimulationResponse> {
  const method = (config.httpMethod || "POST").toUpperCase();
  const url = config.endpointUrl;
  const headers = config.headers;
  let response: any;

  if (method === "GET") {
    response = await apiService.get(url, { headers });
  } else if (method === "PUT") {
    response = await apiService.put(url, payload, { headers });
  } else if (method === "PATCH") {
    response = await apiService.patch(url, payload, { headers });
  } else if (method === "DELETE") {
    response = await apiService.delete(url, { headers });
  } else {
    // Default POST
    response = await apiService.post(url, payload, { headers });
  }

  return {
    prediction: response.data.prediction || 0,
    risk_score: response.data.risk_score || 0,
    recommendation: response.data.recommendation || "Revisar manualmente",
    timestamp: new Date().toISOString(),
  };
}

export async function getSimulationModels(): Promise<Array<{ id: string; name: string; status: string }>> {
  try {
    const response = await apiService.get("/simulation/models", {
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as any[]) || [];
  } catch (error) {
    logApiError("Error al obtener modelos de simulación", error);
    return [];
  }
}

// Nuevas funciones para obtener datos de combos usando endpoints reales
export interface Business {
  id: number;
  name: string;
  country: string;
  status: string;
  tradeName: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  status: string;
}

export interface PaymentMethod {
  id: number;
  type: string;
  last_four: string;
  status: string;
}

export interface ConfigParameter {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export async function getBusinesses(): Promise<Business[]> {
  try {
    const response = await apiService.get(`${ENV.API_URL_TRANSACTIONS}/business`, {
      headers: {
        accept: "*/*",
      },
    });
    
    // La API devuelve un array directo
    const data = Array.isArray(response) ? response : (response.data as any) || [];
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.companyName || `Business ${item.id}`,
      country: item.country || item.countryCode || "",
      status: item.status === 1 ? "active" : "inactive",
      tradeName: item.tradeName,
    }));
  } catch (error) {
    logApiError("Error al obtener negocios", error);
    return [];
  }
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await apiService.get(`${ENV.API_URL_TRANSACTIONS}/customers`, {
      headers: {
        accept: "*/*",
      },
    });
    
    // La API devuelve un array directo
    const data = Array.isArray(response) ? response : (response.data as any) || [];
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name || item.fullName || `Cliente ${item.id}`,
      email: item.email || "",
      status: item.status === 1 ? "active" : "inactive",
    }));
  } catch (error) {
    logApiError("Error al obtener clientes", error);
    return [];
  }
}

export async function getCustomerActivePaymentMethods(customerId: number): Promise<PaymentMethod[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/customers/${customerId}/payment_methods/active`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API devuelve un array directo
    const data = Array.isArray(response) ? response : (response.data as any) || [];
    
    return data.map((item: any) => {
      const numberStr = item.number || "";
      const lastFour = numberStr.replace(/\s/g, "").slice(-4);
      
      return {
        id: item.id,
        type: item.provider || item.typePayment || "Unknown",
        last_four: lastFour,
        status: item.status === 1 ? "active" : "inactive",
      };
    });
  } catch (error) {
    logApiError("Error al obtener métodos de pago activos", error);
    return [];
  }
}

export async function getConfigParameters(parameterType: string): Promise<ConfigParameter[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/configs/parameters/${parameterType}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API puede devolver: array directo, {data: array}, {items: array}, o {clave, valor}[]
    let data: any[] = [];
    const rawResponse = response as any;
    
    if (Array.isArray(rawResponse)) {
      data = rawResponse;
    } else if (Array.isArray(rawResponse?.data)) {
      data = rawResponse.data;
    } else if (Array.isArray(rawResponse?.items)) {
      data = rawResponse.items;
    } else if (rawResponse && typeof rawResponse === 'object') {
      // Si es un objeto único, convertirlo a array
      data = [rawResponse];
    }
    
    // Mapear los datos manejando diferentes formatos
    const mapped = data.map((item: any, index: number) => {
      // Manejar formato {clave, valor} o {name, value} o directo
      const paramValue = item.valor || item.value || item.clave || item.name || item;
      const paramName = item.valor || item.name || item.label || item.clave || paramValue;
      
      return {
        id: item.id?.toString() || `${parameterType}_${index}`,
        name: paramName,
        value: typeof paramValue === 'string' ? paramValue : String(paramValue),
        description: item.descripcion || item.description,
      };
    });
    
    
    return mapped;
  } catch (error) {
    logApiError(`Error al obtener parámetros de configuración para ${parameterType}`, error);
    return [];
  }
}

// Función helper para obtener todos los parámetros de configuración necesarios
export async function getAllConfigParameters(): Promise<{
  browsers: ConfigParameter[];
  deviceTypes: ConfigParameter[];
  cardTypes: ConfigParameter[];
  paymentMethods: ConfigParameter[];
}> {
  try {
    const [browsers, deviceTypes, cardTypes, paymentMethods] = await Promise.all([
      getConfigParameters("browser"),
      getConfigParameters("device_type"),
      getConfigParameters("card_type"),
      getConfigParameters("payment_method"),
    ]);

    return {
      browsers,
      deviceTypes,
      cardTypes,
      paymentMethods,
    };
  } catch (error) {
    logApiError("Error al obtener todos los parámetros de configuración", error);
    return {
      browsers: [],
      deviceTypes: [],
      cardTypes: [],
      paymentMethods: [],
    };
  }
}

export async function validateSimulationConfig(config: SimulationConfig): Promise<boolean> {
  try {
    // Validar que la URL sea accesible
    const response = await fetch(config.endpointUrl, {
      method: "OPTIONS",
      headers: config.headers,
    });
    return response.ok;
  } catch (error) {
    logApiError("Error validando configuración de simulación", error);
    return false;
  }
}

// Helper para loggear errores de forma consistente y evitar "{}" en consola
function logApiError(context: string, error: unknown): void {
  const e = error as Partial<ApiError> & { response?: any };
  const payload = {
    message: e?.message ?? "Error desconocido",
    status: e?.status,
    code: e?.code,
  };
  // Mostrar como objeto expandible y además una línea legible
  console.error(`${context}:`, payload);
}
