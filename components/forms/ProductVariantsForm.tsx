import React, { useState } from "react";
import AddProductVariantDialog from "../AddProductVariantDialog";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "../Motion";
import { containerVariants } from "@/lib/variants";
import { Button } from "../ui/button";
import { Edit, Plus, X } from "lucide-react";

const ProductVariantsForm = ({ form }: { form: any }) => {
  const { watch, setValue } = form;
  const variants = watch("variants");

  const removeVariant = (prompt: string) => {
    setValue(
      "variants",
      variants.filter((variant: any) => variant.optionPrompt !== prompt)
    );
  };

  return (
    <div className="space-y-3">
      <AddProductVariantDialog
        productForm={form}
        dialogTitle="Add Variant"
        dialogDescription=""
      >
        <Button className="w-full" variant={"outline"} size={"lg"}>
          <Plus /> Add Variant
        </Button>
      </AddProductVariantDialog>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence mode="sync">
          {variants.map((variant: any) => (
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key={variant.optionPrompt}
              className="flex items-center justify-between rounded-lg border p-2"
            >
              <div>
                <div className="text-sm font-semibold">
                  {variant.optionPrompt}
                </div>
                <div className="text-xs text-muted-foreground">
                  {variant.options.length} options
                </div>
              </div>

              <div>
                <AddProductVariantDialog
                  productForm={form}
                  dialogTitle="Edit Variant"
                  dialogDescription=""
                  values={variant}
                >
                  <Button variant={"ghost"} size={"icon"}>
                    <Edit />
                  </Button>
                </AddProductVariantDialog>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeVariant(variant.optionPrompt)}
                >
                  <X />
                </Button>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductVariantsForm;
