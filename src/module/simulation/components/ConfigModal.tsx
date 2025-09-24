"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfigPanel } from "./ConfigPanel";

export function ConfigModal({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Configuración de envío</DialogTitle>
          <DialogDescription>
            Ajusta endpoint, método, headers, modelo y opciones de bucle.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <ConfigPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}


