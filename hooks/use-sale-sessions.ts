"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { saleSessions } from "@/db/schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";

interface UseSaleSessionsOptions {
  storeId: string;
  initialData: InferSelectModel<typeof saleSessions>[];
}

export const useSaleSessions = ({
  storeId,
  initialData,
}: UseSaleSessionsOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["saleSessions", storeId],

    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/sale-sessions?storeId=${storeId}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch Sale Sessions");

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
    saleSessions: query.data?.pages.flat() ?? [],
  };
};
