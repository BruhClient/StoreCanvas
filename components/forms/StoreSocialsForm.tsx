"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateStorePayload } from "@/schemas/create-store";
import { Input } from "../ui/input";
import { FormField, FormItem, FormControl, FormLabel } from "../ui/form";

import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const StoreSocialsForm = () => {
  const { watch, setValue, formState, control } =
    useFormContext<CreateStorePayload>();

  return (
    <div className="space-y-5 ">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              Address
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              Instagram
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              WhatsApp
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              Phone Number
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="telegram"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              Telegram
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tiktok"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!field.value && "text-muted-foreground", "text-xs")}
            >
              TikTok
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default StoreSocialsForm;
