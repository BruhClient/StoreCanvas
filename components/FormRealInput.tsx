"use client";
import { useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

type PriceInputProps<T> = {
  form: any;
  name: keyof T;
  label: string;
};

export default function FormRealInput<T>({
  form,
  name,
  label,
}: PriceInputProps<T>) {
  const [displayValue, setDisplayValue] = useState("");

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              value={
                displayValue ||
                (field.value !== undefined ? String(field.value) : "")
              }
              onChange={(e) => {
                // Keep only digits + decimal
                const raw = e.target.value.replace(/[^\d.]/g, "");

                // Enforce max 2 decimal places
                const parts = raw.split(".");
                const formatted =
                  parts.length > 1
                    ? `${parts[0]}.${parts[1].slice(0, 2)}`
                    : parts[0];

                setDisplayValue(formatted);

                // Store as number in RHF
                const numberValue = formatted ? Number(formatted) : undefined;
                field.onChange(numberValue);
              }}
              onBlur={field.onBlur}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
