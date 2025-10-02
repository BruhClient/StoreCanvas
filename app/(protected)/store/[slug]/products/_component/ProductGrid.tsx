"use client";

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/store-context";
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
    <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-2">
      {filteredProducts.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductGrid;
