"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { useSimulationStore } from "../store/simulation.store";
import {
  getBusinesses,
  getCustomers,
  getCustomerActivePaymentMethods,
  getAllConfigParameters,
  type Business,
  type Customer,
  type PaymentMethod,
  type ConfigParameter
} from "../services";

const schema = z.object({
  business_id: z.coerce.number().int().nonnegative(),
  customer_id: z.coerce.number().int().nonnegative(),
  payment_id: z.coerce.number().int().nonnegative(),
  user_id: z.coerce.number().int().nonnegative(),
  transaction_amount: z.coerce.number().positive().multipleOf(0.01),
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

const COUNTRIES = [
  { code: "US", name: "Estados Unidos" },
  { code: "MX", name: "México" },
  { code: "PE", name: "Perú" },
  { code: "CO", name: "Colombia" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "BR", name: "Brasil" },
  { code: "ES", name: "España" },
];

export function TransactionForm({ onSimulate, onChangeValues, shouldReset }: { onSimulate: SubmitHandler<TransactionFormValues>; onChangeValues?: (values: TransactionFormValues) => void; shouldReset?: boolean }) {
  const { form: initialForm } = useSimulationStore();

  // Estados para opciones de los combos
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [browsers, setBrowsers] = useState<ConfigParameter[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<ConfigParameter[]>([]);
  const [cardTypes, setCardTypes] = useState<ConfigParameter[]>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<ConfigParameter[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, reset } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      ...initialForm,
      user_id: undefined, // No tomar user_id del store, debe ser independiente
    } as unknown as TransactionFormValues,
    mode: "onBlur",
  });

  const values = watch();
  const selectedCustomerId = watch("customer_id");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar opciones iniciales
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [businessList, customerList, configParams] = await Promise.all([
          getBusinesses(),
          getCustomers(),
          getAllConfigParameters(),
        ]);

        setBusinesses(businessList);
        setCustomers(customerList);
        setBrowsers(configParams.browsers);
        setDeviceTypes(configParams.deviceTypes);
        setCardTypes(configParams.cardTypes);
        setPaymentMethodOptions(configParams.paymentMethods);


      } catch (error) {
        console.error("Error al cargar opciones:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Cargar métodos de pago cuando cambia el cliente seleccionado
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (selectedCustomerId && selectedCustomerId > 0) {
        try {
          const methods = await getCustomerActivePaymentMethods(selectedCustomerId);
          setPaymentMethods(methods);

          // Si hay métodos de pago y payment_id no está seteado, seleccionar el primero
          if (methods.length > 0 && !values.payment_id) {
            setValue("payment_id", methods[0].id);
          }

          // Asignar el ID del cliente seleccionado al campo user_id
          setValue("user_id", selectedCustomerId);
        } catch (error) {
          console.error("Error al cargar métodos de pago:", error);
          setPaymentMethods([]);
        }
      } else {
        setPaymentMethods([]);
        // Limpiar user_id si no hay cliente seleccionado
        setValue("user_id", 0);
      }
    };

    loadPaymentMethods();
  }, [selectedCustomerId, setValue]);

  useEffect(() => {
    if (!onChangeValues) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Sincronizar todos los valores y asegurar que los campos numéricos sean números
      const normalized = {
        ...values,
        user_id:
          (values as any)?.user_id === undefined || (values as any)?.user_id === null || (values as any)?.user_id === ""
            ? undefined
            : Number((values as any).user_id),
        transaction_amount:
          (values as any)?.transaction_amount === undefined || (values as any)?.transaction_amount === null || (values as any)?.transaction_amount === ""
            ? undefined
            : Number((values as any).transaction_amount),
        business_id:
          (values as any)?.business_id === undefined || (values as any)?.business_id === null || (values as any)?.business_id === ""
            ? undefined
            : Number((values as any).business_id),
        customer_id:
          (values as any)?.customer_id === undefined || (values as any)?.customer_id === null || (values as any)?.customer_id === ""
            ? undefined
            : Number((values as any).customer_id),
        payment_id:
          (values as any)?.payment_id === undefined || (values as any)?.payment_id === null || (values as any)?.payment_id === ""
            ? undefined
            : Number((values as any).payment_id),
        transaction_hour:
          (values as any)?.transaction_hour === undefined || (values as any)?.transaction_hour === null || (values as any)?.transaction_hour === ""
            ? undefined
            : Number((values as any).transaction_hour),
        distance_home_shipping:
          (values as any)?.distance_home_shipping === undefined || (values as any)?.distance_home_shipping === null || (values as any)?.distance_home_shipping === ""
            ? undefined
            : Number((values as any).distance_home_shipping),
        avg_monthly_spend:
          (values as any)?.avg_monthly_spend === undefined || (values as any)?.avg_monthly_spend === null || (values as any)?.avg_monthly_spend === ""
            ? undefined
            : Number((values as any).avg_monthly_spend),
        previous_frauds:
          (values as any)?.previous_frauds === undefined || (values as any)?.previous_frauds === null || (values as any)?.previous_frauds === ""
            ? undefined
            : Number((values as any).previous_frauds),
      } as TransactionFormValues;
      onChangeValues(normalized);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [values, onChangeValues]);

  // Resetear el formulario cuando shouldReset cambie a true
  useEffect(() => {
    if (shouldReset) {
      reset({
        business_id: undefined,
        customer_id: undefined,
        payment_id: undefined,
        user_id: undefined,
        transaction_amount: undefined,
        transaction_hour: undefined,
        is_proxy: undefined,
        distance_home_shipping: undefined,
        avg_monthly_spend: undefined,
        previous_frauds: undefined,
        device_type: undefined,
        browser: undefined,
        country_ip: undefined,
        card_type: undefined,
        payment_method: undefined,
        card_country: undefined,
        business_country: undefined,
      });
    }
  }, [shouldReset, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la transacción</CardTitle>
        <CardDescription>Completa los campos para ejecutar una simulación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSimulate)} className="space-y-6">
          <Accordion type="multiple" defaultValue={["entidades"]} className="w-full space-y-0">
            {/* IDs y Entidades */}
            <AccordionItem value="entidades">
              <AccordionTrigger>
                Entidades
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Business ID */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Negocio *</Label>
                    <Controller
                      name="business_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => field.onChange(Number(value))}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un negocio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona un negocio
                            </SelectItem>
                            {businesses.map((business, idx) => (
                              <SelectItem key={`business_${business.id}_${idx}`} value={business.id.toString()}>
                                {business.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.business_id && <p className="text-xs text-red-600">{String(errors.business_id?.message)}</p>}
                  </div>

                  {/* Customer ID */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Cliente *</Label>
                    <Controller
                      name="customer_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => field.onChange(Number(value))}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona un cliente
                            </SelectItem>
                            {customers.map((customer, idx) => (
                              <SelectItem key={`customer_${customer.id}_${idx}`} value={customer.id.toString()}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.customer_id && <p className="text-xs text-red-600">{String(errors.customer_id?.message)}</p>}
                  </div>

                  {/* Payment ID */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Método de Pago *</Label>
                    <Controller
                      name="payment_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => field.onChange(Number(value))}
                          disabled={isLoadingOptions || paymentMethods.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={paymentMethods.length === 0 ? "Selecciona cliente primero" : "Selecciona método"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              {paymentMethods.length === 0 ? "Selecciona cliente primero" : "Selecciona método"}
                            </SelectItem>
                            {paymentMethods.map((method, idx) => (
                              <SelectItem key={`payment_${method.id}_${idx}`} value={method.id.toString()}>
                                {method.type} - **** {method.last_four}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.payment_id && <p className="text-xs text-red-600">{String(errors.payment_id?.message)}</p>}
                  </div>

                  {/* User ID */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Usuario ID *</Label>
                    <Input type="number" readOnly className="bg-gray-50 cursor-not-allowed" {...register("user_id")} />
                    {errors.user_id && <p className="text-xs text-red-600">{String(errors.user_id?.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Datos de Transacción */}
            <AccordionItem value="datos-transaccion">
              <AccordionTrigger>
                Datos de Transacción
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Monto *</Label>
                    <Input type="number" step="0.01" min="0.01" {...register("transaction_amount")} />
                    {errors.transaction_amount && <p className="text-xs text-red-600">{String(errors.transaction_amount?.message)}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Hora (0-23) *</Label>
                    <Input type="number" min="0" max="23" {...register("transaction_hour")} />
                    {errors.transaction_hour && <p className="text-xs text-red-600">{String(errors.transaction_hour?.message)}</p>}
                  </div>

                  {/* Is Proxy */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Uso de Proxy *</Label>
                    <Controller
                      name="is_proxy"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => field.onChange(value === "" ? undefined : value === "true")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona opción
                            </SelectItem>
                            <SelectItem value="true">Sí (Proxy detectado)</SelectItem>
                            <SelectItem value="false">No (Sin proxy)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.is_proxy && <p className="text-xs text-red-600">{String(errors.is_proxy?.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Datos del Cliente */}
            <AccordionItem value="perfil-cliente">
              <AccordionTrigger>
                Perfil del Cliente
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Distancia Envío (km) *</Label>
                    <Input type="number" {...register("distance_home_shipping")} />
                    {errors.distance_home_shipping && <p className="text-xs text-red-600">{String(errors.distance_home_shipping?.message)}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Gasto Mensual Promedio *</Label>
                    <Input type="number" step="0.01" {...register("avg_monthly_spend")} />
                    {errors.avg_monthly_spend && <p className="text-xs text-red-600">{String(errors.avg_monthly_spend?.message)}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Fraudes Previos *</Label>
                    <Input type="number" min="0" {...register("previous_frauds")} />
                    {errors.previous_frauds && <p className="text-xs text-red-600">{String(errors.previous_frauds?.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Información Técnica */}
            <AccordionItem value="informacion-tecnica">
              <AccordionTrigger>
                Información Técnica
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Device Type */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Tipo de Dispositivo *</Label>
                    <Controller
                      name="device_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona dispositivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona dispositivo
                            </SelectItem>
                            {deviceTypes.length === 0 ? (
                              <SelectItem key="no-devices" value="loading" disabled>
                                Cargando tipos de dispositivo...
                              </SelectItem>
                            ) : (
                              deviceTypes.map((device, idx) => (
                                <SelectItem key={`device_${device.id}_${idx}`} value={device.value}>
                                  {device.name || device.value || "Sin nombre"}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.device_type && <p className="text-xs text-red-600">{String(errors.device_type?.message)}</p>}
                  </div>

                  {/* Browser */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Navegador *</Label>
                    <Controller
                      name="browser"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona navegador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona navegador
                            </SelectItem>
                            {browsers.length === 0 ? (
                              <SelectItem key="no-browsers" value="loading" disabled>
                                Cargando navegadores...
                              </SelectItem>
                            ) : (
                              browsers.map((browser, idx) => (
                                <SelectItem key={`browser_${browser.id}_${idx}`} value={browser.value}>
                                  {browser.name || browser.value || "Sin nombre"}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.browser && <p className="text-xs text-red-600">{String(errors.browser?.message)}</p>}
                  </div>

                  {/* Country IP */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">País IP *</Label>
                    <Controller
                      name="country_ip"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona país" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona país
                            </SelectItem>
                            {COUNTRIES.map((country, idx) => (
                              <SelectItem key={`country_ip_${country.code}_${idx}`} value={country.code}>
                                {country.name} ({country.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.country_ip && <p className="text-xs text-red-600">{String(errors.country_ip?.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Información de Pago */}
            <AccordionItem value="informacion-pago">
              <AccordionTrigger>
                Información de Pago
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card Type */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Tipo de Tarjeta *</Label>
                    <Controller
                      name="card_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona tipo
                            </SelectItem>
                            {cardTypes.length === 0 ? (
                              <SelectItem key="no-cardtypes" value="loading" disabled>
                                Cargando tipos de tarjeta...
                              </SelectItem>
                            ) : (
                              cardTypes.map((cardType, idx) => (
                                <SelectItem key={`cardtype_${cardType.id}_${idx}`} value={cardType.value}>
                                  {cardType.name || cardType.value || "Sin nombre"}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.card_type && <p className="text-xs text-red-600">{String(errors.card_type?.message)}</p>}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">Tipo de Método de Pago *</Label>
                    <Controller
                      name="payment_method"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isLoadingOptions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona método" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona método
                            </SelectItem>
                            {paymentMethodOptions.length === 0 ? (
                              <SelectItem key="no-payment-methods" value="loading" disabled>
                                Cargando métodos de pago...
                              </SelectItem>
                            ) : (
                              paymentMethodOptions.map((method, idx) => (
                                <SelectItem key={`paymentmethod_${method.id}_${idx}`} value={method.value}>
                                  {method.name || method.value || "Sin nombre"}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.payment_method && <p className="text-xs text-red-600">{String(errors.payment_method?.message)}</p>}
                  </div>

                  {/* Card Country */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">País de la Tarjeta *</Label>
                    <Controller
                      name="card_country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona país" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona país
                            </SelectItem>
                            {COUNTRIES.map((country, idx) => (
                              <SelectItem key={`card_country_${country.code}_${idx}`} value={country.code}>
                                {country.name} ({country.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.card_country && <p className="text-xs text-red-600">{String(errors.card_country?.message)}</p>}
                  </div>

                  {/* Business Country */}
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">País del Negocio *</Label>
                    <Controller
                      name="business_country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona país" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__placeholder__" disabled>
                              Selecciona país
                            </SelectItem>
                            {COUNTRIES.map((country, idx) => (
                              <SelectItem key={`business_country_${country.code}_${idx}`} value={country.code}>
                                {country.name} ({country.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.business_country && <p className="text-xs text-red-600">{String(errors.business_country?.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </form>
      </CardContent>
    </Card>
  );
}
