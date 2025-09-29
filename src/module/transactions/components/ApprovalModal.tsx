"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { SuspiciousTransaction } from "../services";
import { getApprovalResults, getApprovalConsequences, getRejectionResults, getRejectionConsequences } from "../../approval/services";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SuspiciousTransaction | null;
  action: "approve" | "reject" | null;
  onConfirm: (transactionId: string, action: "approve" | "reject", data: ApprovalData) => void;
  isLoading?: boolean;
}

interface ApprovalData {
  observation: string;
  result: string;
  consequences: string;
}

interface ApprovalOption {
  id: string;
  name: string;
  value: string;
  description?: string;
}

// Schema de validación con Zod
const approvalFormSchema = z.object({
  observation: z.string().min(1, "La observación es requerida"),
  result: z.string().min(1, "El resultado es requerido"),
  consequences: z.string().min(1, "Las consecuencias son requeridas"),
});

type ApprovalFormValues = z.infer<typeof approvalFormSchema>;

export default function ApprovalModal({
  isOpen,
  onClose,
  transaction,
  action,
  onConfirm,
  isLoading = false,
}: ApprovalModalProps) {
  const [approvalResults, setApprovalResults] = useState<ApprovalOption[]>([]);
  const [approvalConsequences, setApprovalConsequences] = useState<ApprovalOption[]>([]);
  const [rejectionResults, setRejectionResults] = useState<ApprovalOption[]>([]);
  const [rejectionConsequences, setRejectionConsequences] = useState<ApprovalOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ApprovalFormValues>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      observation: "",
      result: "",
      consequences: "",
    },
    mode: "onBlur",
  });

  const watchedValues = watch();

  // Cargar opciones de aprobación/rechazo
  useEffect(() => {
    if (isOpen && action) {
      loadApprovalOptions();
    }
  }, [isOpen, action]);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const loadApprovalOptions = async () => {
    setLoadingOptions(true);
    try {
      if (action === "approve") {
        const [results, consequences] = await Promise.all([
          getApprovalResults(),
          getApprovalConsequences(),
        ]);
        setApprovalResults(results);
        setApprovalConsequences(consequences);
      } else if (action === "reject") {
        const [results, consequences] = await Promise.all([
          getRejectionResults(),
          getRejectionConsequences(),
        ]);
        setRejectionResults(results);
        setRejectionConsequences(consequences);
      }
    } catch (error) {
      console.error("Error al cargar opciones de aprobación:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const onSubmit = (data: ApprovalFormValues) => {
    if (!transaction || !action) {
      return;
    }

    onConfirm(transaction.id, action, {
      observation: data.observation,
      result: data.result,
      consequences: data.consequences,
    });
  };

  if (!transaction || !action) return null;

  const currentResults = action === "approve" ? approvalResults : rejectionResults;
  const currentConsequences = action === "approve" ? approvalConsequences : rejectionConsequences;
  
  // Debug: Log de valores para verificar por qué el botón está deshabilitado
  console.log("Debug ApprovalModal:", {
    isValid,
    isLoading,
    loadingOptions,
    watchedValues,
    currentResults: currentResults?.length,
    currentConsequences: currentConsequences?.length
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === "approve" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {action === "approve" ? "Aprobar Transacción" : "Rechazar Transacción"}
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Confirma la aprobación de esta transacción sospechosa."
              : "Confirma el rechazo de esta transacción sospechosa."}
          </DialogDescription>
        </DialogHeader>

        <form id="approval-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Información de la transacción */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium">Transacción: {transaction.id}</div>
              <div className="text-gray-600">
                {transaction.merchant} • {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(transaction.amount)}
              </div>
              <div className="text-gray-600">
                Riesgo: {transaction.riskScore}% • {transaction.fraudType}
              </div>
            </div>
          </div>

          {/* Observación */}
          <div className="space-y-2">
            <Label htmlFor="observation">
              Observación <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="observation"
              placeholder={`Describe la razón de la ${action === "approve" ? "aprobación" : "rechazo"}...`}
              {...register("observation")}
              rows={3}
            />
            {errors.observation && (
              <p className="text-sm text-red-600">{errors.observation.message}</p>
            )}
          </div>

          {/* Resultado */}
          <div className="space-y-2">
            <Label htmlFor="result">
              Resultado <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedValues.result}
              onValueChange={(value) => setValue("result", value)}
              disabled={loadingOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un resultado" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] z-[9999]">
                {currentResults.length === 0 ? (
                  <SelectItem value="no-options" disabled>
                    {loadingOptions ? "Cargando..." : "No hay opciones disponibles"}
                  </SelectItem>
                ) : (
                  currentResults.map((result, index) => (
                    <SelectItem className="text-sm text-black" key={`${result.id}_${index}`} value={result.value}>
                      {result.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.result && (
              <p className="text-sm text-red-600">{errors.result.message}</p>
            )}
          </div>

          {/* Consecuencias */}
          <div className="space-y-2">
            <Label htmlFor="consequences">
              Consecuencias <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedValues.consequences}
              onValueChange={(value) => setValue("consequences", value)}
              disabled={loadingOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona las consecuencias" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] z-[9999]">
                {currentConsequences.length === 0 ? (
                  <SelectItem value="no-options" disabled>
                    {loadingOptions ? "Cargando..." : "No hay opciones disponibles"}
                  </SelectItem>
                ) : (
                  currentConsequences.map((consequence, index) => (
                    <SelectItem key={`${consequence.id}_${index}`} className="text-sm text-black" value={consequence.value}>
                      {consequence.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.consequences && (
              <p className="text-sm text-red-600">{errors.consequences.message}</p>
            )}
          </div>


          {/* Advertencia */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer.
              {action === "approve"
                ? " La transacción será aprobada y procesada."
                : " La transacción será rechazada y bloqueada."
              }
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="approval-form"
            disabled={!isValid || loadingOptions}
            className={action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLoading ? "Procesando..." : action === "approve" ? "Aprobar" : "Rechazar"}
          </Button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}
