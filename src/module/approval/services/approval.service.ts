// MÓDULO: APROBACIÓN / RECHAZO MANUAL
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";
export interface ApprovalResult {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export interface Consequence {
  id: string;
  name: string;
  value: string;
  description?: string;
}


export async function getApprovalResults(): Promise<ApprovalResult[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/configs/parameters/result_positive`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API puede devolver array directo o response.data
    const rawData = Array.isArray(response) ? response : (response as any)?.data || [];
    const data = Array.isArray(rawData) ? rawData : [];
    
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    
    return uniqueData.map((item: any, index: number) => ({
      id: `result_positive_${index}`,
      name: item.valor || item.clave || item.name || `Opción ${index + 1}`,
      value: item.valor || item.clave || item.value || `opcion_${index + 1}`,
      description: item.descripcion || item.description || item.valor
    }));
  } catch (error: any) {
    console.error("Error al obtener resultados de aprobación:", error);
    // Si el error es 500, retornar opciones por defecto
    if (error?.status === 500) {
      console.warn("API retornó error 500, usando opciones por defecto");
    }
    return [];
  }
}

export async function getApprovalConsequences(): Promise<Consequence[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/configs/parameters/consequence_positive`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API puede devolver array directo o response.data
    const rawData = Array.isArray(response) ? response : (response as any)?.data || [];
    const data = Array.isArray(rawData) ? rawData : [];
    
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    
    return uniqueData.map((item: any, index: number) => ({
      id: `consequence_positive_${index}`,
      name: item.valor || item.clave || item.name || `Opción ${index + 1}`,
      value: item.valor || item.clave || item.value || `opcion_${index + 1}`,
      description: item.descripcion || item.description || item.valor
    }));
  } catch (error: any) {
    console.error("Error al obtener consecuencias de aprobación:", error);
    if (error?.status === 500) {
      console.warn("API retornó error 500, usando opciones por defecto");
    }
    return [];
  }
}

export async function getRejectionResults(): Promise<ApprovalResult[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/configs/parameters/result_negative`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API puede devolver array directo o response.data
    const rawData = Array.isArray(response) ? response : (response as any)?.data || [];
    const data = Array.isArray(rawData) ? rawData : [];
    
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    
    return uniqueData.map((item: any, index: number) => ({
      id: `result_negative_${index}`,
      name: item.valor || item.clave || item.name || `Opción ${index + 1}`,
      value: item.valor || item.clave || item.value || `opcion_${index + 1}`,
      description: item.descripcion || item.description || item.valor
    }));
  } catch (error: any) {
    console.error("Error al obtener resultados de rechazo:", error);
    if (error?.status === 500) {
      console.warn("API retornó error 500, usando opciones por defecto");
    }
    return [];
  }
}

export async function getRejectionConsequences(): Promise<Consequence[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/configs/parameters/consequence_negative`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    
    // La API puede devolver array directo o response.data
    const rawData = Array.isArray(response) ? response : (response as any)?.data || [];
    const data = Array.isArray(rawData) ? rawData : [];
    
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    
    return uniqueData.map((item: any, index: number) => ({
      id: `consequence_negative_${index}`,
      name: item.valor || item.clave || item.name || `Opción ${index + 1}`,
      value: item.valor || item.clave || item.value || `opcion_${index + 1}`,
      description: item.descripcion || item.description || item.valor
    }));
  } catch (error: any) {
    console.error("Error al obtener consecuencias de rechazo:", error);
    if (error?.status === 500) {
      console.warn("API retornó error 500, usando opciones por defecto");
    }
    return [];
  }
}

