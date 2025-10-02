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
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { ConfirmAlertDialog } from "./ConfirmAlertDialog";

export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};

const ProductCard = ({ product }: { product: ProductWithCategories }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { store, productCategories, products } = useStore();
  const { update, remove } = useProducts(store?.id!);

  const updateProduct = (
    updatedProduct: CreateProductPayload,
    isEdit: boolean
  ) => {
    const productNames = products
      .map((item) => item.name)
      .filter((name) => name !== product.name);

    if (productNames.includes(updatedProduct.name)) {
      showErrorToast("Product name already in use");
      return;
    }

    update(product.id, updatedProduct);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="rounded-2xl shadow-lg overflow-hidden hover:bg-muted cursor-pointer transition-all ease-in-out duration-200">
          <CardContent className="flex gap-3 flex-col">
            <div className="rounded-lg relative overflow-hidden border-2 w-full h-50 flex items-center justify-center">
              {product.images?.length === 0 ? (
                <Image
                  src="/placeholder-image.png"
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <Image
                  src={product.images![0] as string}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1 ">
              <div className="flex justify-between w-full items-center">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price}</CardDescription>
              </div>
              <div className="text-muted-foreground font-serif text-xs flex-1 line-clamp-2">
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
            description: product.description ?? "",
            images: product.images ?? [],
            categories: product.categories,
            variants: product.variants ?? [],
          }}
          productCategories={productCategories}
        />
        <ConfirmAlertDialog
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            remove(product.id);
          }}
        >
          <Button variant="outline">
            <Trash />
            Delete Product
          </Button>
        </ConfirmAlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
