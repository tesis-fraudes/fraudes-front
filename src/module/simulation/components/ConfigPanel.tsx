"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useSimulationStore } from "../store/simulation.store";

export function ConfigPanel() {
  const {
    endpointUrl, httpMethod, headersJson, modelName, loopEnabled, intervalMs,
    setConfig
  } = useSimulationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Configuración de envío</CardTitle>
        <CardDescription>Define el endpoint, método, headers y modelo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Endpoint URL</label>
            <Input
              value={endpointUrl}
              onChange={(e) => setConfig({ endpointUrl: e.target.value })}
              placeholder="https://api.mi-backend.com/transactions"
              className="h-11"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Método</label>
            <select
              className="w-full h-11 border rounded px-3 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              value={httpMethod}
              onChange={(e) => setConfig({ httpMethod: e.target.value as any })}
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Modelo a usar</label>
            <Input
              value={modelName}
              onChange={(e) => setConfig({ modelName: e.target.value })}
              placeholder="fraud-detector-v1"
              className="h-11"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">Headers JSON</label>
            <textarea
              className="w-full border rounded p-3 font-mono text-sm min-h-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              value={headersJson}
              onChange={(e) => setConfig({ headersJson: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex items-center gap-2">
            <input id="loop-toggle" type="checkbox" className="h-4 w-4 accent-blue-600" checked={loopEnabled} onChange={(e) => setConfig({ loopEnabled: e.target.checked })} />
            <label htmlFor="loop-toggle" className="text-sm text-gray-700">Enviar en bucle</label>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Intervalo (ms)</label>
            <Input type="number" min={500} step={100} value={intervalMs} onChange={(e) => setConfig({ intervalMs: Number(e.target.value) })} className="h-11" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


