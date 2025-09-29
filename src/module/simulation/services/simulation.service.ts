// MÓDULO: SIMULADOR DE COMPRA (Combos y selección)
import { apiService } from "@/shared/services";

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
  try {
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
  } catch (error) {
    throw error;
  }
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
    console.error("Error al obtener modelos de simulación:", error);
    return [];
  }
}

// Nuevas funciones para obtener datos de combos usando endpoints reales
export interface Business {
  id: number;
  name: string;
  country: string;
  status: string;
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
    const response = await apiService.get("https://fd6bat803l.execute-api.us-east-1.amazonaws.com/business", {
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as any[]) || [];
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    return [];
  }
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await apiService.get("https://fd6bat803l.execute-api.us-east-1.amazonaws.com/customers", {
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as any[]) || [];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
}

export async function getCustomerActivePaymentMethods(customerId: number): Promise<PaymentMethod[]> {
  try {
    const response = await apiService.get(
      `https://fd6bat803l.execute-api.us-east-1.amazonaws.com/customers/${customerId}/payment_methods/active`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return (response.data as any[]) || [];
  } catch (error) {
    console.error("Error al obtener métodos de pago activos:", error);
    return [];
  }
}

export async function getConfigParameters(parameterType: string): Promise<ConfigParameter[]> {
  try {
    const response = await apiService.get(
      `https://fd6bat803l.execute-api.us-east-1.amazonaws.com/configs/parameters/${parameterType}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return (response.data as any[]) || [];
  } catch (error) {
    console.error(`Error al obtener parámetros de configuración para ${parameterType}:`, error);
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
    console.error("Error al obtener todos los parámetros de configuración:", error);
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
    console.error("Error validando configuración de simulación:", error);
    return false;
  }
}
