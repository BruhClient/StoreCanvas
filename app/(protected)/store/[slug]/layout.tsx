import React from "react";
import { StoreProvider } from "@/context/store-context";
import { auth } from "@/lib/auth";
import { fromSlug } from "@/lib/slug";
import { getStoreByName } from "@/server/db/stores";
import { getProductsByStoreId } from "@/server/db/products";
import { getProductCategories } from "@/server/db/productCategories";
import { redirect } from "next/navigation";
import { ClientSidebar } from "@/components/ClientSidebar";
import { InferSelectModel } from "drizzle-orm";
import { stores } from "@/db/schema";

// mockData.ts
export const mockStore = {
  id: "store_123",
  ownerId: "user_123",
  name: "My Mock Store",
  currency: "USD",
  imageUrl: "/mock-store.png",
  allowComments: true,
  isOpen: true,
};

export const mockProducts = [
  {
    id: "prod_1",
    userId: "user_123",
    storeId: "store_123",
    name: "Product A",
    price: 10.5,
    images: ["/product-a.jpg"],
    description: "Mock description A",
    variants: [],
    createdAt: new Date(),
  },
  {
    id: "prod_2",
    userId: "user_123",
    storeId: "store_123",
    name: "Product B",
    price: 20.0,
    images: ["/product-b.jpg"],
    description: "Mock description B",
    variants: [],
    createdAt: new Date(),
  },
];

export const mockCategories = [
  {
    id: "cat_1",
    storeId: "store_123",
    name: "Category 1",
    createdAt: new Date(),
  },
  {
    id: "cat_2",
    storeId: "store_123",
    name: "Category 2",
    createdAt: new Date(),
  },
];

interface StoreDetailsLayoutProps {
  children: React.ReactNode;
}

export const StoreDetailsLayout = ({ children }: StoreDetailsLayoutProps) => {
  const initialData = {
    store: mockStore as InferSelectModel<typeof stores>,
    products: [],
    productCategories: [],
  };

  return (
    <StoreProvider initialData={initialData}>
      <ClientSidebar>{children}</ClientSidebar>
    </StoreProvider>
  );
};

export default StoreDetailsLayout;
