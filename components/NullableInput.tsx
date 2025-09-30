"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type NullableInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
};

export function NullableInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: NullableInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""} // always controlled
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? null : val); // "" → null
              }}
              placeholder={placeholder}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
