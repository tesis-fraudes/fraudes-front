import { apiService } from "./api.service";
import { ENV } from "@/shared/const/env";

export interface Customer {
  id: number;
  name: string;
  email?: string;
  status?: string;
}

/**
 * Obtiene la lista de clientes disponibles
 */
export async function getCustomerList(): Promise<Customer[]> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/customers`,
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
        name: item.name || item.fullName || `Cliente ${item.id}`,
        email: item.email || "",
        status: item.status === 1 ? "active" : "inactive",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error al obtener lista de clientes:", error);
    // En caso de error, devolver array vacío
    return [];
  }
}

