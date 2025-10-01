"use client";

import AddProductDialogForm from "@/components/forms/AddProductDialogForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/context/store-context";
import { productCategories } from "@/db/schema";
import { showErrorToast } from "@/lib/toast";
import { useUploadThing } from "@/lib/uploadthing";
import { CreateProductPayload } from "@/schemas/create-product";
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
  const { startUpload } = useUploadThing("productImages");
  const updateProduct = async (
    product: CreateProductPayload,
    isEdit: boolean
  ) => {
    let imageKeys = [];
    try {
      const res = await startUpload(product.images);

      if (!res) {
        throw Error("Failed to upload images");
      }
      imageKeys = res.map((image) => image.key);

      await createProduct(
        { ...product, images: res.map((image) => image.ufsUrl) },
        store.id
      );

      await queryClient.invalidateQueries({ queryKey: ["products", store.id] });
    } catch (error: any) {
      showErrorToast(error.message);
    }
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
