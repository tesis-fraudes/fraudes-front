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
