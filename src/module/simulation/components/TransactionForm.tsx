"use client";

import { useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulationStore } from "../store/simulation.store";
// no import types to avoid resolver TS mismatch

const schema = z.object({
  business_id: z.coerce.number().int().nonnegative(),
  customer_id: z.coerce.number().int().nonnegative(),
  payment_id: z.coerce.number().int().nonnegative(),
  user_id: z.coerce.number().int().nonnegative(),
  transaction_amount: z.coerce.number().positive(),
  transaction_hour: z.coerce.number().int().min(0).max(23),
  is_proxy: z.coerce.boolean(),
  distance_home_shipping: z.coerce.number().nonnegative(),
  avg_monthly_spend: z.coerce.number().nonnegative(),
  previous_frauds: z.coerce.number().int().nonnegative(),
  device_type: z.string().min(1),
  browser: z.string().min(1),
  country_ip: z.string().min(1),
  card_type: z.string().min(1),
  payment_method: z.string().min(1),
  card_country: z.string().min(1),
  business_country: z.string().min(1),
});

export type TransactionFormValues = z.infer<typeof schema>;

export function TransactionForm({ onSimulate, onChangeValues }: { onSimulate: SubmitHandler<TransactionFormValues>; onChangeValues?: (values: TransactionFormValues) => void }) {
  const { form: initialForm } = useSimulationStore();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: initialForm as unknown as TransactionFormValues,
    mode: "onBlur",
  });

  const values = watch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!onChangeValues) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeValues(values as TransactionFormValues);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [values, onChangeValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la transacción</CardTitle>
        <CardDescription>Completa los campos para ejecutar una simulación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSimulate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">business_id</label>
              <Input type="number" {...register("business_id")} />
              {errors.business_id && <p className="text-xs text-red-600">{String((errors as any).business_id?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">customer_id</label>
              <Input type="number" {...register("customer_id")} />
              {errors.customer_id && <p className="text-xs text-red-600">{String((errors as any).customer_id?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">payment_id</label>
              <Input type="number" {...register("payment_id")} />
              {errors.payment_id && <p className="text-xs text-red-600">{String((errors as any).payment_id?.message)}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">user_id</label>
              <Input type="number" {...register("user_id")} />
              {errors.user_id && <p className="text-xs text-red-600">{String((errors as any).user_id?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">transaction_amount</label>
              <Input type="number" step="0.01" {...register("transaction_amount")} />
              {errors.transaction_amount && <p className="text-xs text-red-600">{String((errors as any).transaction_amount?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">transaction_hour</label>
              <Input type="number" {...register("transaction_hour")} />
              {errors.transaction_hour && <p className="text-xs text-red-600">{String((errors as any).transaction_hour?.message)}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">is_proxy</label>
              <select className="w-full h-10 border rounded px-3 bg-white" {...register("is_proxy")}> 
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
              {errors.is_proxy && <p className="text-xs text-red-600">{String((errors as any).is_proxy?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">distance_home_shipping</label>
              <Input type="number" {...register("distance_home_shipping")} />
              {errors.distance_home_shipping && <p className="text-xs text-red-600">{String((errors as any).distance_home_shipping?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">avg_monthly_spend</label>
              <Input type="number" {...register("avg_monthly_spend")} />
              {errors.avg_monthly_spend && <p className="text-xs text-red-600">{String((errors as any).avg_monthly_spend?.message)}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">previous_frauds</label>
              <Input type="number" {...register("previous_frauds")} />
              {errors.previous_frauds && <p className="text-xs text-red-600">{String((errors as any).previous_frauds?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">device_type</label>
              <Input {...register("device_type")} />
              {errors.device_type && <p className="text-xs text-red-600">{String((errors as any).device_type?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">browser</label>
              <Input {...register("browser")} />
              {errors.browser && <p className="text-xs text-red-600">{String((errors as any).browser?.message)}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">country_ip</label>
              <Input {...register("country_ip")} />
              {errors.country_ip && <p className="text-xs text-red-600">{String((errors as any).country_ip?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">card_type</label>
              <Input {...register("card_type")} />
              {errors.card_type && <p className="text-xs text-red-600">{String((errors as any).card_type?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">payment_method</label>
              <Input {...register("payment_method")} />
              {errors.payment_method && <p className="text-xs text-red-600">{String((errors as any).payment_method?.message)}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">card_country</label>
              <Input {...register("card_country")} />
              {errors.card_country && <p className="text-xs text-red-600">{String((errors as any).card_country?.message)}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">business_country</label>
              <Input {...register("business_country")} />
              {errors.business_country && <p className="text-xs text-red-600">{String((errors as any).business_country?.message)}</p>}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit">Simular riesgo</Button>
            <Button type="button" variant="outline" onClick={() => reset(initialForm)}>Reset</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


