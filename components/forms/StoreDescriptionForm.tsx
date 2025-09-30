"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";

import { FormField, FormItem, FormControl, FormLabel } from "../ui/form";

import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { StoreDescriptionPayload } from "@/schemas/store-steps";

const StoreDescriptionForm = ({
  form,
}: {
  form: UseFormReturn<StoreDescriptionPayload>;
}) => {
  const { control } = form;

  return (
    <div className="space-y-5 ">
      {/* Store Name */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[300px]"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : val); // "" → null
                }}
                placeholder="Give us a brief description of your business..."
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="allowComments"
        render={({ field }) => (
          <FormItem className="flex gap-3 items-center">
            <FormLabel className={cn(!field.value && "text-muted-foreground")}>
              Allow Comments {`( You can turn this off later )`}
            </FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default StoreDescriptionForm;
