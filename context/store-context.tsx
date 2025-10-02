"use client";
// app/store/[storename]/context.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import type { InferSelectModel } from "drizzle-orm";
import { products, stores } from "@/db/schema";
import { editStore } from "@/server/db/stores";

export type Store = InferSelectModel<typeof stores>;

export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};
interface StoreContextValue {
  store: Store;
  setStore: Dispatch<SetStateAction<Store>>;
  products: ProductWithCategories[];
  setProducts: Dispatch<SetStateAction<ProductWithCategories[]>>;
  productCategories: string[];
  setProductCategories: Dispatch<SetStateAction<string[]>>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({
  store: initialStore,
  products: initialProducts,
  productCategories: initialProductCategories,
  children,
}: {
  store: Store;
  products: ProductWithCategories[];
  productCategories: string[];
  children: ReactNode;
}) {
  const [store, setStore] = useState<Store>(initialStore);
  const [products, setProducts] =
    useState<ProductWithCategories[]>(initialProducts);
  const [productCategories, setProductCategories] = useState<string[]>(
    initialProductCategories
  );

  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        products,
        setProducts,
        productCategories,
        setProductCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
