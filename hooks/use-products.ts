"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";

export const useProducts = (filters?: { category?: string; name?: string }) => {
  const user = useSessionUser();

  const query = useInfiniteQuery({
    queryKey: ["products", user?.id],
    queryFn: async ({ pageParam = null }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
      const res = await fetch(
        `/api/decks/all/?take=${DEFAULT_FETCH_LIMIT}${cursorParam}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Decks");
      }

      const data = await res.json();

      return {
        decks: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.decks?.length || !lastPage?.nextCursor) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    staleTime: 0,
    enabled: !!user,
    initialPageParam: null,
  });

  return {
    ...query,
    decks: query.data?.pages.flatMap((page) => page.decks) ?? [],
  };
};
