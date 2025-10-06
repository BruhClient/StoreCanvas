"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseSaleSessionsOptions {
  storeId: string;
}

export const useSaleSessions = ({ storeId }: UseSaleSessionsOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["saleSessions", storeId],

    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/sale-sessions?storeId=${storeId}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch Sale Sessions");

      return (await res.json()) ?? [];
    },

    staleTime: 5 * 60_000, // 5 minutes

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
