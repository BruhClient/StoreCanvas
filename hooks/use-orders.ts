"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { orders, saleSessions } from "@/db/schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";

interface UseSaleSessionsOptions {
  sessionId: string;
  initialData: InferSelectModel<typeof orders>[];
}

export const useOrders = ({
  sessionId,
  initialData,
}: UseSaleSessionsOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["orders", sessionId],

    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/orders?storeId=${sessionId}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch Orders");

      return (await res.json()) ?? [];
    },

    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < DEFAULT_FETCH_LIMIT) {
        return undefined; // No more pages
      }
      return lastPageParam + 1;
    },

    initialPageParam: 0,
  });

  return {
    ...query,
    orders: query.data?.pages.flat() ?? [],
  };
};
