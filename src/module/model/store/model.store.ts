import { create } from "zustand";
import { getModels, activateModel, getActiveModel } from "../services/model.service";

// Tipos de datos para el modelo
export interface ModelData {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  isActive: boolean;
  accuracy?: number;
  status: "active" | "inactive" | "training" | "error";
  urlFile?: string;
  truePositives?: number;
  trueNegatives?: number;
  falsePositives?: number;
  falseNegatives?: number;
}

interface ModelStore {
  // Estado
  models: ModelData[];
  activeModel: ModelData | null;
  isLoading: boolean;
  isActiveModelLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchModels: () => Promise<void>;
  fetchActiveModel: () => Promise<void>;
  setModels: (models: ModelData[]) => void;
  addModel: (model: ModelData) => void;
  updateModel: (id: string, updates: Partial<ModelData>) => void;
  removeModel: (id: string) => void;
  activateModel: (id: string) => Promise<void>;
  clearError: () => void;
  
  // Selectores
  getActiveModel: () => ModelData | undefined;
  getModelById: (id: string) => ModelData | undefined;
}

export const useModelStore = create<ModelStore>((set, get) => ({
  // Estado inicial
  models: [],
  activeModel: null,
  isLoading: false,
  isActiveModelLoading: false,
  error: null,

  // Acciones
  fetchModels: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getModels();
      set({ models: data, isLoading: false });
    } catch (error) {
      console.error("Error al obtener modelos:", error);
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar modelos",
        isLoading: false 
      });
    }
  },

  fetchActiveModel: async () => {
    try {
      set({ isActiveModelLoading: true, error: null });
      const activeModelData = await getActiveModel();
      
      // Si no hay modelo activo, establecer como null
      if (!activeModelData) {
        set({ activeModel: null, isActiveModelLoading: false });
        return;
      }
      
      // Adaptar la respuesta del modelo activo
      const adaptedData = Array.isArray(activeModelData) ? activeModelData[0] : activeModelData;
      
      if (adaptedData?.id) {
        // Crear un objeto ModelData compatible
        const modelData: ModelData = {
          id: adaptedData.id.toString(),
          name: adaptedData.modelName || "Modelo Activo",
          version: `v${adaptedData.id}`,
          uploadedBy: `Usuario ${adaptedData.userId || "Desconocido"}`,
          uploadedAt: adaptedData.createAt ? new Date(adaptedData.createAt) : new Date(),
          fileSize: adaptedData.fileSize || 0,
          isActive: true,
          accuracy: typeof adaptedData.accuracy === "number" ? adaptedData.accuracy * 100 : undefined,
          status: "active",
          urlFile: adaptedData.urlFile,
          truePositives: typeof adaptedData.tp === "number" ? adaptedData.tp : undefined,
          trueNegatives: typeof adaptedData.tn === "number" ? adaptedData.tn : undefined,
          falsePositives: typeof adaptedData.fp === "number" ? adaptedData.fp : undefined,
          falseNegatives: typeof adaptedData.fn === "number" ? adaptedData.fn : undefined,
        };
        
        set({ activeModel: modelData, isActiveModelLoading: false });
      } else {
        set({ activeModel: null, isActiveModelLoading: false });
      }
    } catch (error) {
      console.error("Error al obtener modelo activo:", error);
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar modelo activo",
        isActiveModelLoading: false,
        activeModel: null
      });
    }
  },

  setModels: (models) => set({ models }),

  addModel: (model) => set((state) => ({ 
    models: [...state.models, model] 
  })),

  updateModel: (id, updates) => set((state) => ({
    models: state.models.map(model =>
      model.id === id ? { ...model, ...updates } : model
    )
  })),

  removeModel: (id) => set((state) => ({
    models: state.models.filter(model => model.id !== id)
  })),

  activateModel: async (id) => {
    try {
      // Llamar al servicio de activación
      await activateModel(id);
      
      // Actualizar el estado local
      set((state) => ({
        models: state.models.map(model => ({
          ...model,
          isActive: model.id === id,
          status: model.id === id ? "active" : "inactive"
        }))
      }));

      // Refrescar el modelo activo desde el servicio para obtener métricas actualizadas
      await get().fetchActiveModel();
    } catch (error) {
      console.error("Error al activar modelo:", error);
      set({ error: error instanceof Error ? error.message : "Error al activar modelo" });
      throw error;
    }
  },


  clearError: () => set({ error: null }),

  // Selectores
  getActiveModel: () => {
    const { activeModel } = get();
    return activeModel || undefined;
  },

  getModelById: (id) => {
    const { models } = get();
    return models.find(model => model.id === id);
  },
}));
