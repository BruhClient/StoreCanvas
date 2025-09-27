"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { showErrorToast } from "@/lib/toast";
import {
  VariantOptionPayload,
  VariantOptionSchema,
} from "@/schemas/create-variant";

const AddVariantOptionForm = ({
  addOption,
  options,
  closeDialog,
}: {
  addOption: (name: string, price: number) => void;
  options: { name: string; price: number }[];
  closeDialog: () => void;
}) => {
  const form = useForm<VariantOptionPayload>({
    resolver: zodResolver(VariantOptionSchema),
    defaultValues: { name: "", price: 0 },
  });

  const onSubmit = (
    values: VariantOptionPayload,
    e: React.BaseSyntheticEvent
  ) => {
    e.stopPropagation(); // Prevent parent form submission

    if (options.some((o) => o.name === values.name)) {
      showErrorToast("Option already exists");
      return;
    }

    addOption(values.name, values.price);
    form.reset();
    closeDialog();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => form.handleSubmit((values) => onSubmit(values, e))(e)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Option Name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center rounded-md border px-3">
                  <span className="text-muted-foreground mr-2">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Option
        </Button>
      </form>
    </Form>
  );
};

export default AddVariantOptionForm;
