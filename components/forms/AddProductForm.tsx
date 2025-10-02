"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Edit, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "../Motion";
import { containerVariants } from "@/lib/variants";
import { showErrorToast } from "@/lib/toast";
import { CreateStorePayload } from "@/schemas/create-store";
import AddProductDialogForm from "./AddProductDialogForm";
import { usePrevious } from "@mantine/hooks";

const AddProductForm = ({
  form,
  categories,
}: {
  form: UseFormReturn<Pick<CreateStorePayload, "products" | "categories">>;
  categories: string[];
}) => {
  const { watch, setValue } = form;

  const products = watch("products") || [];

  const prevCategories = usePrevious(categories);

  useEffect(() => {
    if (!prevCategories) return;

    const removedCategories = prevCategories.filter(
      (cat) => !categories.includes(cat)
    );

    if (removedCategories.length === 0) return;

    const updatedProducts = products.map((product) => {
      const updatedCategories =
        product.categories?.filter((cat) => !removedCategories.includes(cat)) ||
        [];

      return {
        ...product,
        categories: updatedCategories,
      };
    });

    setValue("products", updatedProducts);
  }, [categories]);

  // ✅ Separate states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addProduct = (product: any) => {
    if (
      products.find((addedProduct) => addedProduct.name === product.name.trim())
    ) {
      showErrorToast("Product already exists");
      return;
    }

    setValue("products", [...products, product], { shouldValidate: true });
    setAddDialogOpen(false);
  };

  const updateProduct = (product: any, index: number) => {
    const updated = [...products];
    updated[index] = product;
    setValue("products", updated, { shouldValidate: true });
    setEditIndex(null); // close edit dialog
  };

  const removeProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setValue("products", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      {/* Add Product */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline" size="lg">
            <Plus /> Add Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AddProductDialogForm
            productCategories={categories}
            updateProduct={addProduct}
            isDialogOpen={addDialogOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Display added products */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="sync">
          {products.map((product, index) => (
            <MotionDiv
              key={product.name}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={
                "shadow-sm flex justify-between items-center px-3 py-2 rounded-lg border-2"
              }
            >
              <div className="flex flex-col items-start">
                <div className="font-bold text-sm">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  ${product.price}
                </div>
              </div>

              <div className="flex gap-1">
                {/* Edit Product */}
                <Dialog
                  open={editIndex === index}
                  onOpenChange={(open) => setEditIndex(open ? index : null)}
                >
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" type="button">
                      <Edit size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AddProductDialogForm
                      productCategories={form.watch("categories")}
                      updateProduct={(updated) => updateProduct(updated, index)}
                      values={product}
                      isDialogOpen={editIndex === index}
                    />
                  </DialogContent>
                </Dialog>

                {/* Remove Product */}
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => removeProduct(index)}
                >
                  <X size={14} />
                </Button>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddProductForm;
