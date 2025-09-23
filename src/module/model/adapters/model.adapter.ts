// Definir el tipo localmente para evitar importaciones circulares
export interface ModelHistoryItem {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  isActive: boolean;
  accuracy?: number;
  status: "active" | "inactive" | "training" | "error";
}

export function adaptModelsApiResponse(data: unknown): ModelHistoryItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    // Mapear datos reales del API
    const id = item?.id ? item.id.toString() : Math.random().toString();
    const name = typeof item?.modelName === "string" ? item.modelName : "Sin nombre";
    const version = `v${item?.id || "1.0"}`; // Usar ID como versión ya que no hay campo version
    const uploadedBy = `Usuario ${item?.userId || "Desconocido"}`;
    
    let uploadedAt: Date;
    try {
      uploadedAt = item?.createAt ? new Date(item.createAt) : new Date();
      if (Number.isNaN(uploadedAt.getTime())) uploadedAt = new Date();
    } catch {
      uploadedAt = new Date();
    }
    
    const fileSize = 0; // No disponible en la respuesta del API
    const isActive = item?.status === 1; // status 1 = Activo según especificación
    const accuracy = typeof item?.accuracy === "number" ? item.accuracy * 100 : undefined; // Convertir a porcentaje
    
    // Mapear status numérico a string según especificación: 0=Registrado, 1=Activo, 2=Inactivo
    let status: "active" | "inactive" | "training" | "error";
    switch (item?.status) {
      case 0:
        status = "training"; // Registrado = en proceso
        break;
      case 1:
        status = "active"; // Activo
        break;
      case 2:
        status = "inactive"; // Inactivo
        break;
      default:
        status = "inactive";
    }
    
    return {
      id,
      name,
      version,
      uploadedBy,
      uploadedAt,
      fileSize,
      isActive,
      accuracy,
      status,
    };
  });
}
