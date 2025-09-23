"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<((value: boolean) => void) | undefined>();

  const confirm = (
    title: string,
    description?: string,
    opts?: Partial<ConfirmOptions>
  ) => {
    return new Promise<boolean>((resolve) => {
      setOptions({
        title,
        description,
        confirmText: opts?.confirmText ?? "Confirmar",
        cancelText: opts?.cancelText ?? "Cancelar",
      });
      setResolver(() => resolve);
      setOpen(true);
    });
  };

  const ConfirmDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
          {options.description && (
            <DialogDescription>{options.description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resolver?.(false);
              setOpen(false);
            }}
          >
            {options.cancelText}
          </Button>
          <Button
            type="button"
            onClick={() => {
              resolver?.(true);
              setOpen(false);
            }}
          >
            {options.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
}
