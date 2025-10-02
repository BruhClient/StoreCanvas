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
import type { InferSelectModel } from "drizzle-orm";
import { products, stores } from "@/db/schema";
import { getStoreByName } from "@/server/db/stores";
import { useQuery } from "@tanstack/react-query";
import { fromSlug } from "@/lib/slug";
import { useRouter } from "next/navigation";
import { getProductsByStoreId } from "@/server/db/products";
import { getProductCategories } from "@/server/db/productCategories";
import useSessionUser from "@/hooks/use-session-user";

export type Store = InferSelectModel<typeof stores>;

export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};

interface StoreContextValue {
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
  storeName,
  children,
}: {
  storeName: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const user = useSessionUser();

  const [store, setStore] = useState<Store | undefined>(undefined);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["storeContext", storeName],
    queryFn: async () => {
      if (!user) return null;

      const store = await getStoreByName(fromSlug(storeName));
      if (!store || store.ownerId !== user.id) {
        router.push("/store/new");
        return null;
      }

      const products = (await getProductsByStoreId(store.id)) || [];
      const categories = (await getProductCategories(store.id)) || [];
      setStore(store);
      setProducts(products);
      setProductCategories(categories);
      return { store, products, categories };
    },
    enabled: !!user,
  });

  // Sync query data into local state

  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        isFetching,
        products,
        setProducts,
        productCategories,
        setProductCategories,
      }}
    >
      <>{isFetching ? <div>Fetching {storeName}</div> : { children }}</>
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
