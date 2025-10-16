"use client";

import ProductImagesCarousel from "./ProductImagesCarousel";
import { ProductWithCategories } from "@/context/store-context";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: ProductWithCategories;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, getQuantity, decrementQuantity } = useCart();
  const quantity = getQuantity(product.id);

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

        {/* Quantity controls */}
        {quantity > 0 ? (
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
              onClick={() => addToCart(product)}
            >
              <Plus />
            </Button>
          </div>
        ) : (
          <Button
            className="mt-auto flex items-center gap-2"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
