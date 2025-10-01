import { productCategories, products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddProductForm from "./forms/AddProductForm";
import AddProductDialogForm from "./forms/AddProductDialogForm";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/context/store-context";

const ProductCard = ({
  product,
}: {
  product: InferSelectModel<typeof products>;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { store } = useStore();
  const categories = queryClient.getQueryData([
    "categories",
    store.id,
  ]) as InferSelectModel<typeof productCategories>[];
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
        <DialogTitle>Hi</DialogTitle>
        <AddProductDialogForm
          isDialogOpen={isDialogOpen}
          updateProduct={() => {}}
          productCategories={categories.map((category) => category.name) ?? []}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
