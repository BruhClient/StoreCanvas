"use client";

import ProductInfoCard from "@/components/ProductInfoCard";
import { useStore } from "@/context/store-context";
import { Frown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const ProductGrid = () => {
  const { products } = useStore();
  const searchParams = useSearchParams();

  const search = searchParams.get("search")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        !search || product.name.toLowerCase().includes(search);

      const matchesCategory =
        !category || product.categories.includes(category);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-2 product-feed">
        {filteredProducts.map((product) => (
          <ProductInfoCard product={product} key={product.id} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="w-full flex justify-center items-center gap-2 text-muted-foreground font-bold">
          <Frown size={20} /> You have no products
        </div>
      )}
    </>
  );
};

export default ProductGrid;
