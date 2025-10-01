"use client";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/store-context";
import { products } from "@/db/schema";
import { getProductsByStoreId } from "@/server/db/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ProductGrid = () => {
  const { store } = useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["products", store.id],
    queryFn: async () => {
      const products = await getProductsByStoreId(store.id);

      return products ?? [];
    },
    enabled: !!store,
  });

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-2">
      {data?.map((product) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </div>
  );
};

export default ProductGrid;
