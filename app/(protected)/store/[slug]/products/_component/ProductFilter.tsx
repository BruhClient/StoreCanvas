"use client";
import SearchInput from "@/components/SearchInput";
import SearchSelect from "@/components/SearchSelectInput";
import React from "react";
import { useStore } from "@/context/store-context";
import AddProductDialog from "./AddProductDialog";
import ProductCategoryButton from "./ProductCategoryButton";

const ProductFilter = () => {
  const { productCategories } = useStore();

  return (
    <div className="flex gap-1 flex-wrap space-y-2">
      <div className="flex gap-1 w-full product-filters">
        <SearchInput queryParamName="search" className="max-w-lg" />

        <SearchSelect options={productCategories} queryParamName="category" />
      </div>

      <ProductCategoryButton categories={productCategories} />

      <AddProductDialog />
    </div>
  );
};

export default ProductFilter;
