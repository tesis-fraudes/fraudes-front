"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulationStore } from "../store/simulation.store";

export function LogsPanel() {
  const { logs, clearLogs } = useSimulationStore();
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Respuestas del endpoint</CardTitle>
            <CardDescription>Últimas 200 entradas</CardDescription>
          </div>
          <button onClick={clearLogs} className="text-sm text-blue-600">Limpiar</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-auto">
          {logs.length === 0 && <div className="text-sm text-gray-500">Aún no hay registros</div>}
          {logs.map((l, idx) => (
            <div key={idx} className="text-xs font-mono border rounded p-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">{l.time}</span>
                <span className={`px-2 py-0.5 rounded ${l.status === "ok" ? "bg-green-100 text-green-700" : l.status.startsWith("http") ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{l.status}</span>
              </div>
              <pre className="whitespace-pre-wrap break-words">{l.detail}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


