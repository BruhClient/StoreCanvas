import { productCategories } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/lib/toast";
import {
  addProductCategory,
  deleteProductCategory,
} from "@/server/db/productCategories";
import { useStore } from "@/context/store-context";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdditionalFieldsSchema,
  ProductCategoriesSchema,
} from "@/schemas/store-steps";
import CategoriesForm from "@/components/forms/AddProductCategoriesForm";
import { Form } from "@/components/ui/form";

const CategoryFilter = ({
  categories,
}: {
  categories: InferSelectModel<typeof productCategories>[];
}) => {
  const { store } = useStore();
  const queryClient = useQueryClient();
  const addCategory = async (name: string) => {
    addProductCategory(name, store.id).then((data) => {
      if (!data) {
        showErrorToast();
      } else {
        queryClient.setQueryData(
          ["categories", store.id],
          (oldData: InferSelectModel<typeof productCategories>[]) => {
            return [...oldData, data];
          }
        );
      }
    });
  };

  const deleteCategory = (name: string) => {
    deleteProductCategory(name, store.id).then((data) => {
      if (!data) {
        showErrorToast();
      } else {
        queryClient.setQueryData(
          ["categories", store.id],
          (oldData: InferSelectModel<typeof productCategories>[]) => {
            return oldData.filter((category) => category.name !== name);
          }
        );
      }
    });
  };

  const form = useForm({
    resolver: zodResolver(ProductCategoriesSchema),
    defaultValues: {
      categories: categories.map((categories) => categories.name),
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Categories</DialogTitle>
          <DialogDescription>
            Create or delete new product categories{" "}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {/* @ts-ignore */}
          <div className="min-h-[300px]">
            <CategoriesForm
              //@ts-ignore
              form={form}
              add={addCategory}
              remove={deleteCategory}
            />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFilter;
