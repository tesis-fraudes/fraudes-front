"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionTabs } from "./TransactionTabs";
import { ConfigModal } from "./ConfigModal";
import { LogsPanel } from "./LogsPanel";
import { useSimulationStore } from "../store/simulation.store";
import type { TransactionFormValues } from "./TransactionForm";
import { Loader2, RotateCcw } from "lucide-react";

export default function ContentSimulationCompraPage() {
  // estado interno sólo para resultado
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [shouldResetForm, setShouldResetForm] = useState<boolean>(false);
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const { form, endpointUrl, httpMethod, headersJson, addLog, setForm } =
    useSimulationStore();


  const appendLog = (status: string, detail: string) => addLog({ status, detail });

  const parseHeaders = (): Record<string, string> | null => {
    try {
      const parsed = JSON.parse(headersJson || "{}");
      return parsed;
    } catch {
      appendLog("error", "JSON de headers inválido");
      return null;
    }
  };

  const buildPayload = () => ({ ...form });

  const clearForm = () => {
    // Activar el reset del formulario
    setShouldResetForm(true);
    
    // Limpiar el store
    setForm({
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
      device_type: null,
      browser: null,
      country_ip: null,
      card_type: null,
      payment_method: null,
      card_country: null,
      business_country: null,
    });
    appendLog("info", "Formulario limpiado");
  };

  const sendOnce = async () => {
    if (isSending) return;
    setIsSending(true);
    const headers = parseHeaders();
    if (!headers) return;
    if (!endpointUrl) {
      appendLog("error", "Endpoint vacío");
      setIsSending(false);
      return;
    }

    const payload = buildPayload();
    try {
      const res = await fetch(endpointUrl, {
        method: httpMethod,
        headers,
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      appendLog(res.ok ? "ok" : `http ${res.status}`, text);
    } catch (err: any) {
      appendLog("network", err?.message || "Error de red");
    } finally {
      setIsSending(false);
    }
  };


  useEffect(() => {
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, []);

  // Resetear el flag de reset después de que se ejecute
  useEffect(() => {
    if (shouldResetForm) {
      setShouldResetForm(false);
    }
  }, [shouldResetForm]);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap">Simulación de compra</h1>
        <p className="text-gray-600 mt-1">Probar decisiones del motor sin afectar producción</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setIsConfigOpen(true)} className="text-sm text-blue-600">
          Abrir configuración
        </button>
      </div>

      <TransactionTabs
        onSimulate={(values: TransactionFormValues) => {
          // usa los valores del form para simular riesgo local simple (placeholder)
          setForm(values as any);
        }}
        onChangeValues={(values: TransactionFormValues) => setForm(values as any)}
        shouldReset={shouldResetForm}
      />

      <div className="flex gap-2 justify-end">
        <Button onClick={clearForm} variant="outline" className="bg-transparent whitespace-nowrap">
          <RotateCcw className="mr-2 h-4 w-4" />
          Limpiar formulario
        </Button>
        <Button onClick={sendOnce} disabled={isSending} aria-disabled={isSending} variant="outline" className="bg-transparent whitespace-nowrap">
          {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSending ? "Enviando..." : "Enviar al endpoint"}
        </Button>
      </div>

      <ConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} />

      <LogsPanel />
    </div>
  );
}
