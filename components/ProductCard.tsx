import { productCategories, products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddProductDialogForm from "./forms/AddProductDialogForm";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/context/store-context";
import { updateProduct } from "@/server/db/products";
import { CreateProductPayload } from "@/schemas/create-product";
import { useProducts } from "@/hooks/useProducts";
import { useUploadThing } from "@/lib/uploadthing";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";

export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};

const ProductCard = ({ product }: { product: ProductWithCategories }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { store } = useStore();
  const { update } = useProducts(store.id);
  const { startUpload } = useUploadThing("productImages");
  const categories = queryClient.getQueryData([
    "categories",
    store.id,
  ]) as InferSelectModel<typeof productCategories>[];

  const updateProduct = async (
    updatedProduct: CreateProductPayload,
    isEdit: boolean
  ) => {
    if (!store) return;

    // Get cached products
    const products = queryClient.getQueryData<ProductWithCategories[]>([
      "products",
      store.id,
    ]);

    // Check for duplicate product name
    if (products) {
      const isDuplicate = products.some(
        (p) =>
          p.name.trim().toLowerCase() ===
            updatedProduct.productName.toLowerCase() && p.id !== product.id
      );
      if (isDuplicate) {
        showErrorToast(
          "A product with this name already exists in your store."
        );
        return;
      }
    }

    setIsDialogOpen(false);

    // Split images into existing URLs vs new files
    const existingUrls = updatedProduct.images.filter(
      (img): img is string => typeof img === "string"
    );
    const newFiles = updatedProduct.images.filter(
      (img): img is File => img instanceof File
    );

    const oldUrls = product.images ?? [];
    const imagesChanged =
      newFiles.length > 0 ||
      oldUrls.length !== existingUrls.length ||
      oldUrls.some((url) => !existingUrls.includes(url));

    let uploadedUrls: string[] = [];
    let uploadedKeys: string[] = [];
    let toastId: string | number | undefined;

    // ----------------- PARTIALLY OPTIMISTIC UPDATE -----------------
    // Optimistically update the cache if images are not changing
    if (!imagesChanged) {
      queryClient.setQueryData<ProductWithCategories[]>(
        ["products", store.id],
        (old = []) =>
          old.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  ...updatedProduct,
                }
              : p
          )
      );
    }

    try {
      // Show loading toast only if images changed
      if (imagesChanged) {
        toastId = showLoadingToast("Uploading images...", "Please wait...");
      }

      // Upload new files if any
      if (newFiles.length > 0) {
        const uploadResult = await startUpload(newFiles);
        if (!uploadResult) throw new Error("Image upload failed");

        uploadedUrls = uploadResult.map((f) => f.url.trim());
        uploadedKeys = uploadResult.map((f) => f.key.trim());
      }

      // Determine removed images
      const removedUrls =
        oldUrls.filter((url) => !existingUrls.includes(url)) ?? [];
      if (removedUrls.length > 0) {
        const removedKeys = removedUrls.map((url) =>
          url.split("/").pop()!.trim()
        );
        await Promise.all(
          removedKeys.map((key) => deleteFileFromUploadthing(key))
        );
      }

      // Final images array
      const finalImages = [
        ...existingUrls.map((u) => u.trim()),
        ...uploadedUrls,
      ];

      // Update the product in DB
      update(product.id, {
        ...updatedProduct,

        images: finalImages,
      });

      queryClient.invalidateQueries({ queryKey: ["products", store.id] });

      if (toastId) {
        showSuccessToast(
          "Product updated!",
          "Your product was successfully updated."
        );
      }
    } catch (err) {
      console.error("Failed to update product:", err);

      // Rollback uploaded images if DB update fails
      if (uploadedKeys.length > 0) {
        try {
          await Promise.all(
            uploadedKeys.map((key) => deleteFileFromUploadthing(key))
          );
          console.log("Rolled back uploaded files:", uploadedKeys);
        } catch (rollbackErr) {
          console.error("Rollback failed:", rollbackErr);
        }
      }

      showErrorToast("Failed to update product.");

      // Revert optimistic cache if it was applied
      if (!imagesChanged) {
        queryClient.setQueryData<ProductWithCategories[]>(
          ["products", store.id],
          products
        );
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="rounded-2xl shadow-lg overflow-hidden hover:bg-muted cursor-pointer transition-all ease-in-out duration-200">
          <CardContent className="flex gap-3">
            <div className="rounded-lg overflow-hidden border-2 w-40 h-40 flex items-center justify-center">
              {product.images?.length === 0 ? (
                <Image
                  src={"/placeholder-image.png"}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={product.images![0] as string}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1 ">
              <div className="flex justify-between w-full items-center">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price}</CardDescription>
              </div>
              <div className="text-muted-foreground font-serif text-sm flex-1 line-clamp-2">
                {product.description
                  ? product.description
                  : "no description..."}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product</DialogDescription>
        </DialogHeader>
        <AddProductDialogForm
          isDialogOpen={isDialogOpen}
          updateProduct={updateProduct}
          values={{
            ...product,
            productName: product.name,
            description: product.description ?? "",
            images: product.images ?? [],
            categories: product.categories,
            variants: product.variants ?? [],
          }}
          productCategories={categories.map((category) => category.name) ?? []}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
