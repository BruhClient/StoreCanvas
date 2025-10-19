import FlexImage from "@/components/FlexImage";
import { MotionDiv } from "@/components/Motion";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { stores } from "@/db/schema";
import { containerVariants } from "@/lib/variants";
import { ProductWithCategories } from "@/types/product";
import { InferSelectModel } from "drizzle-orm";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { useMemo, useState } from "react";
import CartButton from "./CartButton";

const StoreProductCatalog = ({
  products,
  categories,
  store,
}: {
  products: ProductWithCategories[];
  categories: string[];
  store: InferSelectModel<typeof stores>;
}) => {
  const [filters, setFilters] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    if (filters.length === 0) return products;

    const items = products.filter((product) =>
      product.categories.some((cat: string) => filters.includes(cat))
    );

    return items;
  }, [filters, products]);

  return (
    <div className="space-y-4 relative">
      <div className="w-full flex justify-between">
        <div className="flex gap-3 items-center">
          <FlexImage
            src={store.imageUrl || "/placeholder-image.png"}
            alt={store.name}
            width={42}
            height={42}
            aspectRatio="1/1"
            rounded="2xl"
          />
          <div>
            <div className="text-sm font-semibold">{store.name}</div>
            <div className="text-muted-foreground text-xs">
              Prices set in {store.currency}
            </div>
          </div>
        </div>

        <CartButton />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => {
          return (
            <Button
              onClick={() => {
                if (filters.includes(category)) {
                  setFilters((prev) =>
                    prev.filter((filter) => filter !== category)
                  );
                } else {
                  setFilters((prev) => [...prev, category]);
                }
              }}
              key={category}
              variant={filters.includes(category) ? "default" : "outline"}
            >
              {category}
            </Button>
          );
        })}
      </div>
      <div className="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-3 pb-11 ">
        <AnimatePresence>
          {filteredProducts.map((product) => {
            return (
              <MotionDiv
                key={product.id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProductCard product={product} key={product.id} />
              </MotionDiv>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoreProductCatalog;
