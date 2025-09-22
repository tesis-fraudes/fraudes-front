"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showTime?: boolean;
}

export function DatePicker({
  label,
  placeholder = "Seleccionar fecha",
  value,
  onChange,
  disabled = false,
  required = false,
  className,
  showTime = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value);

  // Sincronizar el mes cuando cambie el valor
  React.useEffect(() => {
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder;

    if (showTime) {
      return format(date, "dd/MM/yyyy HH:mm", { locale: es });
    }

    return format(date, "dd/MM/yyyy", { locale: es });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
            disabled={disabled}
          >
            {formatDate(value)}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[110]" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              if (date) {
                console.log(date);

                // Crear una nueva fecha para evitar problemas de zona horaria
                const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                console.log(newDate);
                onChange?.(newDate);
                setMonth(newDate);
              } else {
                onChange?.(undefined);
              }
              setOpen(false);
            }}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface DateTimePickerProps extends Omit<DatePickerProps, "showTime"> {
  showTime?: boolean;
}

export function DateTimePicker({
  label,
  placeholder = "Seleccionar fecha y hora",
  value,
  onChange,
  disabled = false,
  required = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState("");
  const [month, setMonth] = React.useState<Date | undefined>(value);

  // Sincronizar el mes cuando cambie el valor
  React.useEffect(() => {
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return placeholder;
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Crear una nueva fecha para evitar problemas de zona horaria
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Si hay un tiempo seleccionado, aplicarlo a la fecha
      if (timeValue) {
        const [hours, minutes] = timeValue.split(":");
        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      }

      onChange?.(newDate);
      setMonth(newDate);
    } else {
      onChange?.(undefined);
    }
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
            disabled={disabled}
          >
            {formatDateTime(value)}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[110]" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
            />
            <div className="mt-3 pt-3 border-t">
              <Label className="text-sm font-medium mb-2 block">Hora</Label>
              <input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
