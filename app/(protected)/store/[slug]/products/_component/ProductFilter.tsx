"use client";
import SearchInput from "@/components/SearchInput";
import SearchSelect from "@/components/SearchSelectInput";
import React from "react";
import CategoryFilter from "./CategoryFilter";
import { useStore } from "@/context/store-context";
import AddProductDialog from "./AddProductDialog";

const ProductFilter = () => {
  const { store, productCategories } = useStore();

  return (
    <div className="flex gap-1 flex-wrap">
      <SearchInput queryParamName="search" className="max-w-lg" />

      <SearchSelect options={productCategories} queryParamName="category" />

      <CategoryFilter categories={productCategories} />

      <AddProductDialog />
    </div>
  );
};

export default ProductFilter;
