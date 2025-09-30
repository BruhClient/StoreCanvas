import { products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";

type Product = InferSelectModel<typeof products>;
const ProductGrid = ({ products }: { products: Product[] }) => {
  return <div>ProductGrid</div>;
};

export default ProductGrid;
