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
  status: 'active' | 'inactive' | 'training' | 'error';
}

export function adaptModelsApiResponse(data: unknown): ModelHistoryItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    // Corrección y saneamiento de datos
    const id = item?.id ? item.id.toString() : Math.random().toString();
    const name = typeof item?.modelo === "string" ? item.modelo : "Sin nombre";
    const version = typeof item?.version === "string" ? item.version : "1.0";
    const uploadedBy = "Desconocido";
    let uploadedAt: Date;
    try {
      uploadedAt = item?.createAt ? new Date(item.createAt) : new Date();
      if (isNaN(uploadedAt.getTime())) uploadedAt = new Date();
    } catch {
      uploadedAt = new Date();
    }
    const fileSize = 0;
    const isActive = item?.status === "Activo";
    let accuracy: number | undefined = undefined;
    // A veces la data viene con un % al final, así que lo quitamos antes de convertir
    if (typeof item?.accuracy === "string") {
      const accuracyStr = item.accuracy.replace('%', '').trim();
      if (!isNaN(Number(accuracyStr))) {
        accuracy = parseFloat(accuracyStr);
      }
    }
    const status = isActive ? "active" : "inactive";
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