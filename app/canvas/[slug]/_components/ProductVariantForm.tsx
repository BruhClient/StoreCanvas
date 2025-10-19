"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VariantOptionPayload, VariantPayload } from "@/schemas/create-variant";
import { cn } from "@/lib/utils";

interface ProductVariantFormProps {
  variants: VariantPayload[];
  addToCart: (selected: Record<string, string[]>) => void;
}

const ProductVariantForm = ({
  variants,
  addToCart,
}: ProductVariantFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const handleSelect = (
    prompt: string,
    optionName: string,
    maxSelections: number
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[prompt] || [];

      if (maxSelections === 1) {
        return { ...prev, [prompt]: [optionName] };
      }

      if (current.includes(optionName)) {
        return { ...prev, [prompt]: current.filter((o) => o !== optionName) };
      }

      if (current.length >= maxSelections) {
        return prev;
      }

      return { ...prev, [prompt]: [...current, optionName] };
    });
  };

  const allRequiredSelected = variants.every((v) =>
    v.required ? (selectedOptions[v.optionPrompt]?.length ?? 0) > 0 : true
  );

  return (
    <div className="space-y-8 max-h-[400px] overflow-y-auto">
      {variants.map((variant) => {
        const selected = selectedOptions[variant.optionPrompt] || [];
        const isMulti = variant.maxSelections > 1;

        return (
          <Card
            key={variant.optionPrompt}
            className="border rounded-xl shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">
                  {variant.optionPrompt}
                  {variant.required && (
                    <span className="text-red-500 text-sm ml-1">*</span>
                  )}
                </h3>
                {isMulti && (
                  <span className="text-xs text-muted-foreground">
                    {selected.length}/{variant.maxSelections} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {variant.options.map((option: VariantOptionPayload) => {
                  const isSelected = selected.includes(option.name);
                  const reachedMax =
                    isMulti && selected.length >= variant.maxSelections;
                  const disableOption = !isSelected && reachedMax;

                  return (
                    <button
                      key={option.name}
                      type="button"
                      disabled={disableOption}
                      onClick={() =>
                        handleSelect(
                          variant.optionPrompt,
                          option.name,
                          variant.maxSelections
                        )
                      }
                      className={cn(
                        "rounded-lg border p-3 text-sm text-left transition-all",
                        "hover:bg-muted/60 active:scale-[0.98]",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background",
                        disableOption && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="font-medium">{option.name}</div>
                      {option.price > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          +${option.price}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button
        className="w-full py-5 text-base font-medium"
        disabled={!allRequiredSelected}
        onClick={() => addToCart(selectedOptions)}
      >
        Add to cart
      </Button>
    </div>
  );
};

export default ProductVariantForm;
