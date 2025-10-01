"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
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

// Schema de validación con Zod (para formulario interno)
const approvalFormSchema = z.object({
  observation: z.string().min(10, "La observación debe tener al menos 10 caracteres"),
  result: z.array(z.string()).min(1, "Selecciona al menos un resultado"),
  consequences: z.array(z.string()).min(1, "Selecciona al menos una consecuencia"),
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
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<ApprovalFormValues>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      observation: "",
      result: [],
      consequences: [],
    },
    mode: "onChange",
  });

  const watchedValues = watch();
  
  // Validar manualmente si el formulario es válido
  const isFormValid = 
    watchedValues.observation?.length >= 10 && 
    watchedValues.result?.length > 0 && 
    watchedValues.consequences?.length > 0;

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
    if (!transaction || !action || !transaction.fraud_event_id) {
      return;
    }
    
    // Convertir arrays a strings separados por "||"
    onConfirm(transaction.fraud_event_id, action, {
      observation: data.observation,
      result: data.result.join("||"),
      consequences: data.consequences.join("||"),
    });
  };

  if (!transaction || !action) return null;

  const currentResults = action === "approve" ? approvalResults : rejectionResults;
  const currentConsequences = action === "approve" ? approvalConsequences : rejectionConsequences;
  
  // Convertir opciones a formato MultiSelect
  const resultOptions = currentResults.map(item => ({
    label: item.name,
    value: item.value,
  }));
  
  const consequenceOptions = currentConsequences.map(item => ({
    label: item.name,
    value: item.value,
  }));

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
            <Controller
              name="result"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={resultOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Selecciona uno o más resultados"
                  disabled={loadingOptions || resultOptions.length === 0}
                  maxCount={2}
                  className="w-full"
                />
              )}
            />
            {errors.result && (
              <p className="text-sm text-red-600">{errors.result.message}</p>
            )}
          </div>

          {/* Consecuencias */}
          <div className="space-y-2">
            <Label htmlFor="consequences">
              Consecuencias <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="consequences"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={consequenceOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Selecciona una o más consecuencias"
                  disabled={loadingOptions || consequenceOptions.length === 0}
                  maxCount={2}
                  className="w-full"
                />
              )}
            />
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
            disabled={!isFormValid || isLoading || loadingOptions}
            className={action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLoading ? "Procesando..." : action === "approve" ? "Aprobar" : "Rechazar"}
          </Button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}
