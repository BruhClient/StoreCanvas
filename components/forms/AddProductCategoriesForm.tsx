"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "../Motion";
import { containerVariants } from "@/lib/variants";
import { CreateStorePayload } from "@/schemas/create-store";
import { showErrorToast } from "@/lib/toast";

const CategoriesForm = ({
  form,
  add,
  remove,
}: {
  add?: (name: string) => void;
  remove?: (name: string) => void;
  form: UseFormReturn<Pick<CreateStorePayload, "categories" | "products">>;
}) => {
  const { watch, setValue, trigger } = form;
  const categories = watch("categories") || [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.includes(name)) {
      showErrorToast("Category already exists");
      return;
    }

    if (add) {
      add(name);
    }
    setValue("categories", [...categories, name], { shouldValidate: true });
    setNewCategory("");
    setDialogOpen(false);
    await trigger("categories");
  };

  const removeCategory = (index: number) => {
    const removed = categories[index];
    const updated = categories.filter((_, i) => i !== index);
    setValue("categories", updated, { shouldValidate: true });

    // remove category from products
    const products = watch("products") || [];
    const updatedProducts = products.map((p: any) => ({
      ...p,
      categories: p.categories.filter((c: string) => c !== removed),
    }));
    if (remove) {
      remove(removed);
    }

    setValue("products", updatedProducts, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant={"outline"} size={"lg"}>
            <Plus /> Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Category</DialogTitle>
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <Input
              value={newCategory}
              placeholder="Category Name"
              onChange={(e) => {
                const value = e.target.value.replace(/\s{2,}/g, " "); // replace 2+ spaces with single space
                setNewCategory(value);
              }}
            />
            <Button onClick={addCategory} className="mt-2 w-full" type="button">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="sync">
          {categories.map((cat, i) => (
            <MotionDiv
              key={cat}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full"
            >
              <span>{cat}</span>
              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => removeCategory(i)}
              >
                <X size={14} />
              </Button>
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoriesForm;
