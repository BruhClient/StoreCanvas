"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateStorePayload } from "@/schemas/create-store";
import { Input } from "../ui/input";
import { FormField, FormItem, FormControl, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const currencies = ["USD", "SGD", "MYR"];

const StoreDescriptionForm = () => {
  const { watch, setValue, formState, control } =
    useFormContext<CreateStorePayload>();

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
