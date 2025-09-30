"use client";
// app/store/[storename]/context.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { stores } from "@/db/schema";
import { editStore } from "@/server/db/stores";

export type Store = InferSelectModel<typeof stores>;

interface StoreContextValue {
  store: Store;
  setStore: (store: Store) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({
  store: initialStore,
  children,
}: {
  store: Store;
  children: ReactNode;
}) {
  const [store, setStore] = useState<Store>(initialStore);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
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
