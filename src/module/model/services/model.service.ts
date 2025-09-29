// MÓDULO: TRANSACCIÓN (Predicciones y compras)
import { apiService } from "@/shared/services";
import { adaptModelsApiResponse } from "../adapters/model.adapter";

export interface SaveModelPayload {
  file: File | Blob;
  modelo: string;
  version: string;
  accuracy: string;
  status: string;
}

export async function saveModel({
  file,
  modelo,
  version,
  accuracy,
  status,
}: SaveModelPayload) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("modelo", modelo);
  formData.append("version", version);
  formData.append("accuracy", accuracy);
  formData.append("status", status);
  const response = await apiService.post("/neural-network/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*",
    },
  });
  return response.data;
}

export interface TrainModelPayload {
  file: File | Blob;
  modelName: string;
  userCode: string | number;
}

export async function trainModel({ file, modelName, userCode }: TrainModelPayload) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("modelName", modelName);
  formData.append("userCode", String(userCode));

  const response = await apiService.post("/neural-network/train", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*",
    },
  });
  return response.data;
}

export async function getModels() {
  try {
    const response = await apiService.get("/neural-network", {
      headers: {
        accept: "*/*",
      },
    });
    const adaptedResponse = adaptModelsApiResponse(response);

    return adaptedResponse;
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    return [];
  }
}

export async function getModelById(id: string | number) {
  const response = await apiService.get(`/neural-network/${id}`, {
    headers: {
      accept: "*/*",
    },
  });
  return response.data;
}

export async function activateModel(id: string | number) {
  try {
    const response = await apiService.post("/neural-network/active", 
      { id },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al activar modelo:", error);
    throw error;
  }
}

export async function getActiveModel() {
  try {
    const response = await apiService.get("/neural-network/active", {
      headers: {
        accept: "*/*",
      },
    });
  
    
    return response;
  } catch (error) {
    console.error("Error al obtener modelo activo:", error);
    
    // Si no hay modelo activo, devolver null en lugar de lanzar error
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any;
      if (apiError.response?.status === 404) {
        return null;
      }
    }
    
    throw error;
  }
}

// Nueva función para predicción de transacciones usando el endpoint real
export interface TransactionPredictionPayload {
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

export interface TransactionPredictionResponse {
  prediction: number;
  risk_score: number;
  is_fraud: boolean;
  confidence: number;
  recommendation: string;
}

export async function predictTransaction(payload: TransactionPredictionPayload): Promise<TransactionPredictionResponse> {
  try {
    const response = await apiService.post(
      "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/transaction/purchase",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
    
    const data = response.data as any;
    return {
      prediction: data.prediction || 0,
      risk_score: data.risk_score || 0,
      is_fraud: data.is_fraud || false,
      confidence: data.confidence || 0,
      recommendation: data.recommendation || "Revisar manualmente",
    };
  } catch (error) {
    console.error("Error al predecir transacción:", error);
    throw error;
  }
}
