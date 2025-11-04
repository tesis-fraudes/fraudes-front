import { create } from "zustand";
import {
  getOverviewData,
  type OverviewData,
  type OverviewFilters,
} from "../services/overview.service";

interface OverviewState {
  // Estado
  data: OverviewData | null;
  isLoading: boolean;
  error: string | null;
  filters: OverviewFilters;
  lastGenerated: Date | null;

  // Acciones
  setFilters: (filters: OverviewFilters) => void;
  generateOverview: () => Promise<void>;
  clearData: () => void;
  clearError: () => void;
}

const defaultFilters: OverviewFilters = {
  businessId: null,
  startDate: null,
  endDate: null,
};

export const useOverviewStore = create<OverviewState>((set, get) => ({
  // Estado inicial
  data: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,
  lastGenerated: null,

  // Acciones
  setFilters: (filters) => {
    set({ filters });
  },

  generateOverview: async () => {
    const { filters } = get();

    // Validar que haya al menos un filtro
    if (!filters.businessId && !filters.startDate && !filters.endDate) {
      set({
        error:
          "Debe seleccionar al menos un filtro (Comercio o rango de fechas)",
      });
      return;
    }

    // Validar rango de fechas
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      set({ error: "La fecha de inicio debe ser anterior a la fecha de fin" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await getOverviewData(filters);
      set({
        data,
        isLoading: false,
        lastGenerated: new Date(),
      });
    } catch (error: any) {
      set({
        error: error.message || "Error al generar el overview",
        isLoading: false,
      });
    }
  },

  clearData: () => {
    set({
      data: null,
      lastGenerated: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
