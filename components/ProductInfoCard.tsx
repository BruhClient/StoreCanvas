import { productCategories, products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { ProductWithCategories, useStore } from "@/context/store-context";
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
import FlexImage from "./FlexImage";

const ProductInfoCard = ({ product }: { product: ProductWithCategories }) => {
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
          <CardContent className="flex gap-4 items-center">
            <FlexImage
              src={
                product.images?.length === 0
                  ? "/placeholder-image.png"
                  : product.images![0]
              }
              alt={product.name}
              width={100}
              height={100}
            />

            <div className="flex-1">
              <div className="space-y-2">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {" "}
                  {product.description
                    ? product.description
                    : "No product description found"}
                </CardDescription>
              </div>
              <div className="font-bold text-lg pt-4">$ {product.price}</div>
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

export default ProductInfoCard;
