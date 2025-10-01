"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/store-context";

export const useProducts = () => {
  const { store } = useStore();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const query = useInfiniteQuery({
    queryKey: ["products", store?.id, search, category],
    queryFn: async ({ pageParam = null }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const categoryParam = category
        ? `&category=${encodeURIComponent(category)}`
        : "";

      const res = await fetch(
        `/api/products?take=${DEFAULT_FETCH_LIMIT}${cursorParam}${searchParam}${categoryParam}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Products");
      }

      const data = await res.json();

      return {
        products: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.products?.length || !lastPage?.nextCursor) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    staleTime: 0,
    enabled: !!store,
    initialPageParam: null,
  });

  return {
    ...query,
    products: query.data?.pages.flatMap((page) => page.products) ?? [],
  };
};
