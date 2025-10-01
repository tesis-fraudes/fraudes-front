import { ENV } from "../const/env";
import { apiService } from "./api.service";

export interface Business {
  id: number;
  name: string;
  description?: string;
}

/**
 * Obtiene la lista de negocios disponibles
 */
export async function getBusinessList(): Promise<Business[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/business`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve el array directamente en response
    const data = Array.isArray(response) ? response : (response.data as any) || [];

    // Mapear los datos de la API al formato esperado
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name || `Business ${item.id}`,
        description: item.description,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error al obtener lista de negocios:", error);
    // En caso de error, devolver array vacío
    return [];
  }
}
