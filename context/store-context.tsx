"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { InferSelectModel } from "drizzle-orm";
import { products, stores } from "@/db/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Store = InferSelectModel<typeof stores>;
export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};

export interface StoreContextValue {
  store?: Store;
  isFetching: boolean;
  setStore: Dispatch<SetStateAction<Store | undefined>>;
  products: ProductWithCategories[];
  setProducts: Dispatch<SetStateAction<ProductWithCategories[]>>;
  productCategories: string[];
  setProductCategories: Dispatch<SetStateAction<string[]>>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);
export function StoreProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: {
    store?: Store;
    products: ProductWithCategories[];
    productCategories: string[];
  };
}) {
  const queryClient = useQueryClient();

  const [store, setStore] = useState(initialData.store);
  const [products, setProducts] = useState(initialData.products);
  const [productCategories, setProductCategories] = useState(
    initialData.productCategories
  );

  useEffect(() => {
    queryClient.setQueryData(["storeContext", store?.id], {
      store,
      products,
      productCategories,
    });
  }, [store, products, productCategories, queryClient]);

  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        isFetching: false,
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

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
