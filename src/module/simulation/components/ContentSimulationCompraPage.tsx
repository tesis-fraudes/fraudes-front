"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Store, MapPin, CreditCard } from "lucide-react";
import { TransactionTabs } from "./TransactionTabs";
import { ConfigModal } from "./ConfigModal";
import { LogsPanel } from "./LogsPanel";
import { useSimulationStore } from "../store/simulation.store";
import type { TransactionFormValues } from "./TransactionForm";
import { getApprovalResults } from "../../approval/services/approval.service";

type SimulationResult = {
  riskScore: number;
  decision: "aprobada" | "rechazada" | "revisión";
  reasons: string[];
};

export default function ContentSimulationCompraPage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  // estado interno sólo para resultado
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [approvalOptions, setApprovalOptions] = useState<Array<{clave: string, valor: string}>>([]);
  const [selectedApprovalReason, setSelectedApprovalReason] = useState<string>("");
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const { form, endpointUrl, httpMethod, headersJson, intervalMs, addLog, setForm } =
    useSimulationStore();

  const simulate = async () => {
    // stub local basado en payload real
    await new Promise((r) => setTimeout(r, 300));
    const base = Math.min(100, Math.max(0, Math.log10(form.transaction_amount || 1) * 25));
    const geoPenalty = /MX|CO|VE|AR|CL/i.test(form.card_country) ? 8 : 5;
    const prevFraudPenalty = Math.min(25, (form.previous_frauds || 0) * 7);
    const proxyPenalty = form.is_proxy ? 10 : 0;
    const distancePenalty = Math.min(15, (form.distance_home_shipping || 0) / 50);
    const randomness = Math.floor(Math.random() * 10);
    const riskScore = Math.min(
      100,
      Math.round(base + geoPenalty + prevFraudPenalty + proxyPenalty + distancePenalty + randomness)
    );

    const decision: SimulationResult["decision"] =
      riskScore >= 80 ? "rechazada" : riskScore >= 60 ? "revisión" : "aprobada";
    const reasons: string[] = [];
    if (riskScore >= 80) reasons.push("Riesgo alto por factores combinados");
    if (riskScore >= 60 && riskScore < 80) reasons.push("Transacción requiere revisión manual");
    if ((form.transaction_amount || 0) > 1500) reasons.push("Monto inusualmente alto");
    if (form.previous_frauds > 0) reasons.push("Historial previo de fraudes");
    if (form.is_proxy) reasons.push("Uso de proxy detectado");

    setResult({ riskScore, decision, reasons });
  };

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

  const sendOnce = async () => {
    const headers = parseHeaders();
    if (!headers) return;
    if (!endpointUrl) {
      appendLog("error", "Endpoint vacío");
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
      appendLog(res.ok ? "ok" : `http ${res.status}`, text.slice(0, 300));
    } catch (err: any) {
      appendLog("network", err?.message || "Error de red");
    }
  };

  const startLoop = () => {
    if (isLoopRunning) return;
    setIsLoopRunning(true);
    loopRef.current = setInterval(
      () => {
        sendOnce();
      },
      Math.max(500, intervalMs)
    );
  };

  const stopLoop = () => {
    setIsLoopRunning(false);
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, []);

  // Cargar opciones de aprobación al montar el componente
  useEffect(() => {
    const loadApprovalOptions = async () => {
      try {
        const options = await getApprovalResults();
        // Mapear ApprovalResult a {clave, valor}
        const mappedOptions = options.map(option => ({
          clave: option.name,
          valor: option.value
        }));
        setApprovalOptions(mappedOptions);
      } catch (error) {
        console.error("Error cargando opciones de aprobación:", error);
      }
    };
    loadApprovalOptions();
  }, []);

  // Generación con Faker ahora está en el formulario o acciones separadas (no usado aquí)

  const renderRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Alto Riesgo</Badge>;
    if (score >= 60) return <Badge variant="secondary">Riesgo Medio</Badge>;
    return <Badge variant="default">Bajo Riesgo</Badge>;
  };

  const decisionLabel = (decisionValue: SimulationResult["decision"]) =>
    decisionValue === "rechazada"
      ? "Rechazada"
      : decisionValue === "revisión"
        ? "Requiere Revisión"
        : "Aprobada";

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Simulación de compra</h1>
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
          simulate();
        }}
        onChangeValues={(values: TransactionFormValues) => setForm(values as any)}
      />

      <div className="flex gap-2 justify-end">
        {!isLoopRunning ? (
          <Button onClick={startLoop} className="bg-blue-600 hover:bg-blue-700">
            Iniciar bucle
          </Button>
        ) : (
          <Button onClick={stopLoop} variant="destructive">
            Detener bucle
          </Button>
        )}
        <Button onClick={sendOnce} variant="outline" className="bg-transparent">
          Enviar al endpoint
        </Button>
      </div>

      <ConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} />

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" /> Resultado
            </CardTitle>
            <CardDescription>Evaluación basada en las entradas suministradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold">Riesgo: {result.riskScore}%</span>
              {renderRiskBadge(result.riskScore)}
              <Badge
                variant={
                  result.decision === "rechazada"
                    ? "destructive"
                    : result.decision === "revisión"
                      ? "secondary"
                      : "default"
                }
              >
                {decisionLabel(result.decision)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Store className="h-4 w-4" /> <span>{form.device_type || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="h-4 w-4" /> <span>{form.payment_method || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4" /> <span>{form.business_country || "—"}</span>
              </div>
            </div>

            {result.reasons.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-2">Notas</div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.decision === "aprobada" && approvalOptions.length > 0 && (
              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-2 block">Razón de aprobación:</label>
                <select
                  value={selectedApprovalReason}
                  onChange={(e) => setSelectedApprovalReason(e.target.value)}
                  className="w-full h-10 border rounded px-3 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="">Selecciona una razón...</option>
                  {approvalOptions.map((option, index) => (
                    <option key={index} value={option.valor}>
                      {option.valor}
                    </option>
                  ))}
                </select>
                {selectedApprovalReason && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    <strong>Razón seleccionada:</strong> {selectedApprovalReason}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <LogsPanel />
    </div>
  );
}
