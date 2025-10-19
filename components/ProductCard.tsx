"use client";

import ProductImagesCarousel from "./ProductImagesCarousel";
import { ProductWithCategories } from "@/context/store-context";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import DialogButton from "./DialogButton";
import ProductVariantForm from "@/app/canvas/[slug]/_components/ProductVariantForm";
import { useState } from "react";
import { Button } from "./ui/button";
import DeleteVariantDialogButton from "@/app/canvas/[slug]/_components/DeleteVariantDialogButton";

interface ProductCardProps {
  product: ProductWithCategories;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, getQuantity, decrementQuantity } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sum quantity of this product across all variants
  const quantity = getQuantity(product.id);

  const handleAddVariantProduct = (selected: Record<string, string[]>) => {
    addToCart({
      ...product,
      variantInfo: product.variants,
      variants: selected,
    });
    setDialogOpen(false); // close dialog after adding
  };

  return (
    <div className="flex flex-col rounded-2xl border overflow-hidden h-full">
      {/* Product Images */}
      <ProductImagesCarousel
        images={product.images || []}
        visibleOnHover
        height="h-[250px]"
      />

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        <div className="font-medium line-clamp-1">{product.name}</div>
        <div className="text-muted-foreground text-sm mb-2">
          $ {product.price}
        </div>

        {/* Products without variants */}
        {!product.variants?.length &&
          (quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => decrementQuantity(product.id)}
              >
                <Minus />
              </Button>
              <div className="flex-1 text-center">{quantity}</div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => addToCart({ ...product, variants: null })}
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <Button
              className="mt-auto flex items-center gap-2"
              onClick={() => addToCart({ ...product, variants: null })}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
          ))}

        {/* Products with variants */}
        {product.variants?.length !== 0 &&
          (quantity > 0 ? (
            <div className="flex items-center gap-2">
              <DeleteVariantDialogButton
                productId={product.id}
                productName={product.name}
              />
              <div className="flex-1 text-center">{quantity}</div>

              {/* Plus button opens dialog for selecting variants */}
              <DialogButton
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                buttonContent={
                  <Button size="icon" variant="outline">
                    <Plus />
                  </Button>
                }
                title={product.name}
                description={product.description ?? ""}
              >
                <ProductVariantForm
                  variants={product.variants!}
                  addToCart={handleAddVariantProduct}
                />
              </DialogButton>
            </div>
          ) : (
            <DialogButton
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
              buttonContent={
                <Button className="mt-auto flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>
              }
              title={product.name}
              description={product.description ?? ""}
            >
              <ProductVariantForm
                variants={product.variants!}
                addToCart={handleAddVariantProduct}
              />
            </DialogButton>
          ))}
      </div>
    </div>
  );
};

export default ProductCard;
