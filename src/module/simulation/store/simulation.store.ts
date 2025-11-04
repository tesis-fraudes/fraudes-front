import { create } from "zustand";
import { ENV } from "@/shared/const/env";
import type { HttpMethod, PurchaseTransactionPayload } from "../types";

interface SimulationState {
  // Configuración
  endpointUrl: string;
  httpMethod: HttpMethod;
  headersJson: string;
  modelName: string;
  loopEnabled: boolean;
  intervalMs: number;

  // Form data
  form: PurchaseTransactionPayload;

  // Logs
  logs: Array<{ time: string; status: string; detail: string }>;

  // Acciones
  setConfig: (
    cfg: Partial<
      Pick<
        SimulationState,
        | "endpointUrl"
        | "httpMethod"
        | "headersJson"
        | "modelName"
        | "loopEnabled"
        | "intervalMs"
      >
    >
  ) => void;
  setForm: (updates: Partial<PurchaseTransactionPayload>) => void;
  addLog: (entry: { status: string; detail: string }) => void;
  clearLogs: () => void;
}

const defaultHeaders = '{\n  "Content-Type": "application/json"\n}';

const defaultForm: PurchaseTransactionPayload = {
  business_id: null,
  customer_id: null,
  payment_id: null,
  user_id: null,
  transaction_amount: null,
  transaction_hour: null,
  is_proxy: null,
  distance_home_shipping: null,
  avg_monthly_spend: null,
  previous_frauds: null,
  device_type: null, //"mobile",
  browser: null, // "Brave",
  country_ip: null, // "US",
  card_type: null, //"Visa",
  payment_method: null, //"paypal",
  card_country: null, //"MX",
  business_country: null, // "US",
};

export const useSimulationStore = create<SimulationState>((set) => ({
  endpointUrl:
    `${ENV.API_URL_TRANSACTIONS}/transaction/purchase`,
  httpMethod: "POST",
  headersJson: defaultHeaders,
  modelName: "",
  loopEnabled: false,
  intervalMs: 3000,
  form: defaultForm,
  logs: [],

  setConfig: (cfg) => set((s) => ({ ...s, ...cfg })),
  setForm: (updates) => set((s) => ({ form: { ...s.form, ...updates } })),
  addLog: ({ status, detail }) =>
    set((s) => ({
      logs: [
        {
          time: new Date().toLocaleTimeString(),
          status,
          detail,
        },
        ...s.logs,
      ].slice(0, 200),
    })),
  clearLogs: () => set({ logs: [] }),
}));
