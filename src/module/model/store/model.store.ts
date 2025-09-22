import { create } from "zustand";
import { getModels } from "../services/model.service";

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
}

interface ModelStore {
  // Estado
  models: ModelData[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchModels: () => Promise<void>;
  setModels: (models: ModelData[]) => void;
  addModel: (model: ModelData) => void;
  updateModel: (id: string, updates: Partial<ModelData>) => void;
  removeModel: (id: string) => void;
  activateModel: (id: string) => void;
  pauseModel: (id: string) => void;
  trainModel: (id: string) => void;
  clearError: () => void;
  
  // Selectores
  getActiveModel: () => ModelData | undefined;
  getModelById: (id: string) => ModelData | undefined;
}

export const useModelStore = create<ModelStore>((set, get) => ({
  // Estado inicial
  models: [],
  isLoading: false,
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

  activateModel: (id) => set((state) => ({
    models: state.models.map(model => ({
      ...model,
      isActive: model.id === id,
      status: model.id === id ? "active" : "inactive"
    }))
  })),

  pauseModel: (id) => set((state) => ({
    models: state.models.map(model =>
      model.id === id 
        ? { ...model, isActive: false, status: "inactive" }
        : model
    )
  })),

  trainModel: (id) => set((state) => {
    const models = state.models.map(model =>
      model.id === id 
        ? { ...model, status: "training" as const }
        : model
    );
    
    // Simular finalización del entrenamiento después de 3 segundos
    setTimeout(() => {
      set((currentState) => ({
        models: currentState.models.map(model =>
          model.id === id 
            ? { 
                ...model, 
                status: "active" as const,
                accuracy: (model.accuracy || 0) + 1,
                version: model.version.replace(/\d+$/, (match) => String(parseInt(match) + 1))
              }
            : model
        )
      }));
    }, 3000);

    return { models };
  }),

  clearError: () => set({ error: null }),

  // Selectores
  getActiveModel: () => {
    const { models } = get();
    return models.find(model => model.isActive);
  },

  getModelById: (id) => {
    const { models } = get();
    return models.find(model => model.id === id);
  },
}));
