"use client";

import AddProductDialogForm from "@/components/forms/AddProductDialogForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/context/store-context";
import { productCategories, products } from "@/db/schema";
import { useProducts } from "@/hooks/useProducts";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useUploadThing } from "@/lib/uploadthing";
import { CreateProductPayload } from "@/schemas/create-product";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { createProduct } from "@/server/db/products";
import { useQueryClient } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const AddProductDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { store } = useStore();
  // Get cached data for a specific query
  const categories = queryClient.getQueryData([
    "categories",
    store.id,
  ]) as InferSelectModel<typeof productCategories>[];

  const storeProducts = queryClient.getQueryData([
    "products",
    store.id,
  ]) as InferSelectModel<typeof products>[];

  const { create, update, remove, isPending } = useProducts(store.id);

  const updateProduct = async (
    product: CreateProductPayload,
    isEdit: boolean
  ) => {
    if (
      storeProducts
        .map((product) => product.name)
        .includes(product.productName.trim())
    ) {
      showErrorToast("Product already exist");
      return;
    }
    create(product);
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AddProductDialogForm
          productCategories={
            categories ? categories.map((category) => category.name) : []
          }
          updateProduct={updateProduct}
          isDialogOpen={isDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
