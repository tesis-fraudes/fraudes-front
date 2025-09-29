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
    // El backend devuelve {clave, valor}, mapeamos a {id, name, value}
    const data = (response as any) || [];
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    return uniqueData.map((item: any, index: number) => ({
      id: `${item.clave}_${index}` || `option_${index}`,
      name: item.valor || item.clave || `Opción ${index + 1}`,
      value: item.valor || item.clave || `opcion_${index + 1}`,
      description: item.descripcion || item.valor
    }));
  } catch (error) {
    console.error("Error al obtener resultados de aprobación:", error);
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
    // El backend devuelve {clave, valor}, mapeamos a {id, name, value}
    const data = (response as any) || [];
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    return uniqueData.map((item: any, index: number) => ({
      id: `${item.clave}_${index}` || `option_${index}`,
      name: item.valor || item.clave || `Opción ${index + 1}`,
      value: item.valor || item.clave || `opcion_${index + 1}`,
      description: item.descripcion || item.valor
    }));
  } catch (error) {
    console.error("Error al obtener consecuencias de aprobación:", error);
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
    // El backend devuelve {clave, valor}, mapeamos a {id, name, value}
    const data = (response as any) || [];
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    return uniqueData.map((item: any, index: number) => ({
      id: `${item.clave}_${index}` || `option_${index}`,
      name: item.valor || item.clave || `Opción ${index + 1}`,
      value: item.valor || item.clave || `opcion_${index + 1}`,
      description: item.descripcion || item.valor
    }));
  } catch (error) {
    console.error("Error al obtener resultados de rechazo:", error);
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
    // El backend devuelve {clave, valor}, mapeamos a {id, name, value}
    const data = (response as any) || [];
    // Filtrar duplicados y crear IDs únicos
    const uniqueData = data.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.clave === item.clave && t.valor === item.valor)
    );
    return uniqueData.map((item: any, index: number) => ({
      id: `${item.clave}_${index}` || `option_${index}`,
      name: item.valor || item.clave || `Opción ${index + 1}`,
      value: item.valor || item.clave || `opcion_${index + 1}`,
      description: item.descripcion || item.valor
    }));
  } catch (error) {
    console.error("Error al obtener consecuencias de rechazo:", error);
    return [];
  }
}

