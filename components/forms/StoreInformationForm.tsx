"use client";

import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { FormField, FormItem, FormControl, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { StoreInformationPayload } from "@/schemas/store-steps";

const currencies = ["USD", "SGD", "MYR"];

const StoreInformationForm = ({
  form,
}: {
  form: UseFormReturn<StoreInformationPayload>;
}) => {
  const { watch, control, getValues } = form;
  const imageFile = watch("imageFile");
  const [preview, setPreview] = useState<string | null>(() => {
    const initial = getValues("imageFile");
    // if initial value is a string (URL), use it
    return typeof initial === "string" ? initial : null;
  });

  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      return;
    }

    // If it's a File object, read as data URL
    if (imageFile instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    } else if (typeof imageFile === "string") {
      // If it's a URL, just set it
      setPreview(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="space-y-5">
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
              <Input
                {...field}
                placeholder="Store Name"
                onChange={(e) => {
                  const value = e.target.value.replace(/\s{2,}/g, " "); // replace 2+ spaces with single space
                  field.onChange(value);
                }}
              />
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
