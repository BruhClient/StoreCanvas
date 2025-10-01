"use client";
import SearchInput from "@/components/SearchInput";
import SearchSelect from "@/components/SearchSelectInput";
import React from "react";
import CategoryFilter from "./CategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/context/store-context";
import { getProductCategories } from "@/server/db/productCategories";
import { Skeleton } from "@/components/ui/skeleton";
import AddProductDialog from "./AddProductDialog";

const ProductFilter = () => {
  const { store } = useStore();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", store.id],
    queryFn: async () => {
      const productCategories = await getProductCategories(store.id);

      return productCategories;
    },
    enabled: !!store,
  });

  return (
    <div className="flex gap-1 flex-wrap">
      <SearchInput queryParamName="search" className="max-w-lg" />

      {!categories ? (
        <Skeleton className="h-9 w-16" />
      ) : (
        <SearchSelect
          options={categories?.map((category) => category.name)}
          queryParamName="category"
        />
      )}
      {categories !== null && !isLoading ? (
        <CategoryFilter categories={categories!} />
      ) : (
        <Skeleton className="h-9 w-24" />
      )}
      <AddProductDialog />
    </div>
  );
};

export default ProductFilter;
