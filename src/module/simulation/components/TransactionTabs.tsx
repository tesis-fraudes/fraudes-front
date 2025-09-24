"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionForm, type TransactionFormValues } from "./TransactionForm";
import { useSimulationStore } from "../store/simulation.store";

export function TransactionTabs({ onSimulate, onChangeValues }: { onSimulate: (values: TransactionFormValues) => void; onChangeValues?: (values: TransactionFormValues) => void }) {
  const { form } = useSimulationStore();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(form, null, 2));
    } catch {
      // noop
    }
  };

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="mb-3">
        <TabsTrigger value="form">Formulario</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <TransactionForm onSimulate={onSimulate as any} onChangeValues={onChangeValues} />
      </TabsContent>

      <TabsContent value="json">
        <Card>
          <CardContent className="p-0">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="text-sm text-gray-400">Vista JSON (solo lectura)</div>
              <Button size="sm" variant="outline" className="bg-transparent" onClick={copyToClipboard}>Copiar</Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-md overflow-auto text-sm max-h-[480px]">
{JSON.stringify(form, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


