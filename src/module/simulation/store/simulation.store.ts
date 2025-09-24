import { create } from "zustand";
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
  setConfig: (cfg: Partial<Pick<SimulationState, "endpointUrl" | "httpMethod" | "headersJson" | "modelName" | "loopEnabled" | "intervalMs">>) => void;
  setForm: (updates: Partial<PurchaseTransactionPayload>) => void;
  addLog: (entry: { status: string; detail: string }) => void;
  clearLogs: () => void;
}

const defaultHeaders = '{\n  "Content-Type": "application/json"\n}';

const defaultForm: PurchaseTransactionPayload = {
  business_id: 1,
  customer_id: 1,
  payment_id: 1,
  user_id: 1,
  transaction_amount: 760.5,
  transaction_hour: 2,
  is_proxy: true,
  distance_home_shipping: 120,
  avg_monthly_spend: 300,
  previous_frauds: 1,
  device_type: "Mobile",
  browser: "Brave",
  country_ip: "US",
  card_type: "Visa",
  payment_method: "paypal",
  card_country: "MX",
  business_country: "US",
};

export const useSimulationStore = create<SimulationState>((set) => ({
  endpointUrl: "https://fd6bat803l.execute-api.us-east-1.amazonaws.com/transaction/purchase",
  httpMethod: "POST",
  headersJson: defaultHeaders,
  modelName: "",
  loopEnabled: false,
  intervalMs: 3000,
  form: defaultForm,
  logs: [],

  setConfig: (cfg) => set((s) => ({ ...s, ...cfg })),
  setForm: (updates) => set((s) => ({ form: { ...s.form, ...updates } })),
  addLog: ({ status, detail }) => set((s) => ({
    logs: [{
      time: new Date().toLocaleTimeString(),
      status,
      detail,
    }, ...s.logs].slice(0, 200)
  })),
  clearLogs: () => set({ logs: [] }),
}));


