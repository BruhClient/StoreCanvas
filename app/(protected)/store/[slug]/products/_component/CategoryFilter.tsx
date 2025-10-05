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
import { showErrorToast } from "@/lib/toast";
import {
  addProductCategory,
  deleteProductCategory,
} from "@/server/db/productCategories";
import { useStore } from "@/context/store-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCategoriesSchema } from "@/schemas/store-steps";
import CategoriesForm from "@/components/forms/AddProductCategoriesForm";
import { Form } from "@/components/ui/form";

const CategoryFilter = ({ categories }: { categories: string[] }) => {
  const { store, setProductCategories, setProducts } = useStore();
  const addCategory = async (name: string) => {
    setProductCategories((prev) => [...prev, name]);

    addProductCategory(name, store?.id!).then((data) => {
      if (!data) {
        setProductCategories((prev) =>
          prev.filter((category) => category !== name)
        );
        showErrorToast();
      }
    });
  };

  const deleteCategory = (name: string) => {
    setProductCategories((prev) =>
      prev.filter((category) => category !== name)
    );

    deleteProductCategory(name, store?.id!).then((data) => {
      if (!data) {
        setProductCategories((prev) => [...prev, name]);
        showErrorToast();
      } else {
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            categories: p.categories.filter((c) => c !== name),
          }))
        );
      }
    });
  };

  const form = useForm({
    resolver: zodResolver(ProductCategoriesSchema),
    defaultValues: {
      categories,
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
