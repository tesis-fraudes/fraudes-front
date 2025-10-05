"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulationStore } from "../store/simulation.store";

export function LogsPanel() {
  const { logs, clearLogs } = useSimulationStore();
  const [flashKey, setFlashKey] = useState<string | null>(null);

  // ordenar: último primero y limitar 200 items
  const ordered = useMemo(() => {
    return [...logs].slice(-200).reverse();
  }, [logs]);

  // detectar y resaltar el último agregado
  useEffect(() => {
    if (logs.length === 0) return;
    const last = logs[logs.length - 1];
    const key = `${last?.time ?? ""}`;
    setFlashKey(key);
    const id = setTimeout(() => setFlashKey(null), 1200);
    return () => clearTimeout(id);
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Respuestas del endpoint</CardTitle>
          </div>
          <button onClick={clearLogs} className="text-sm text-blue-600">Limpiar</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-auto">
          {ordered.length === 0 && <div className="text-sm text-gray-500">Aún no hay registros</div>}
          {ordered.map((l, idx) => {
            let pretty = l.detail;
            try {
              const parsed = JSON.parse(l.detail);
              pretty = JSON.stringify(parsed, null, 2);
            } catch {
              // keep original detail if not valid JSON
            }

            const isFlash = flashKey && l.time === flashKey;
            return (
              <div key={idx} className={`text-xs font-mono border rounded p-2 transition-colors ${isFlash ? "bg-yellow-50" : "bg-white"}`}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{l.time}</span>
                  <span className={`px-2 py-0.5 rounded ${l.status === "ok" ? "bg-green-100 text-green-700" : l.status.startsWith("http") ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{l.status}</span>
                </div>
                <pre className="whitespace-pre-wrap break-words overflow-auto bg-gray-900 text-gray-100 p-4 rounded-b-md text-sm max-h-[400px]">{pretty}</pre>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


