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

const currencies = ["USD", "SGD", "MYR"];

const StoreInformationForm = () => {
  const { watch, setValue, formState, control } =
    useFormContext<CreateStorePayload>();
  const imageFile = watch("imageFile");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) return setPreview(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(imageFile as File);
  }, [imageFile]);

  return (
    <div className="space-y-5 ">
      {/* Image Upload */}
      <FormField
        control={control}
        name="imageFile"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files?.[0] || null)}
              />
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">Click to upload image</span>
                )}
              </div>
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => field.onChange(null)}
                className="text-red-500 text-sm underline"
              >
                Remove Image
              </button>
            )}
          </FormItem>
        )}
      />

      {/* Store Name */}
      <FormField
        control={control}
        name="storeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Store Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Store Name" />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Currency */}
      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Currency</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default StoreInformationForm;
