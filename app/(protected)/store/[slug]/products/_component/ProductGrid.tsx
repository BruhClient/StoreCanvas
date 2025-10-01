"use client";
import ProductCard from "@/components/ProductCard";
import { products } from "@/db/schema";
import { useProducts } from "@/hooks/use-products";
import { useIntersection } from "@mantine/hooks";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useRef } from "react";

const ProductGrid = () => {
  const { isLoading, products, fetchNextPage, isFetching, hasNextPage } =
    useProducts();
  const lastFolderRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastFolderRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry]);

  return (
    <div className="grid grid-cols-3">
      {products?.map((product, index) => {
        if (index >= products.length - 1) {
          return (
            <div key={product.id} ref={ref}>
              <ProductCard product={product} />
            </div>
          );
        }
        return <ProductCard key={product.id} product={product} />;
      })}
      {isFetching && <div>HIIII</div>}
    </div>
  );
};

export default ProductGrid;
