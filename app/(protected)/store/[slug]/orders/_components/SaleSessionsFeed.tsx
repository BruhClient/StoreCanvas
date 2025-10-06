"use client";

import { useSaleSessions } from "@/hooks/use-sale-sessions";
import { useIntersection } from "@mantine/hooks";
import React, { useEffect, useRef } from "react";
const FolderFeed = ({ storeId }: { storeId: string }) => {
  const { saleSessions, fetchNextPage, hasNextPage, isFetching } =
    useSaleSessions({ storeId });

  const lastFolderRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastFolderRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry]);

  return <div></div>;
};

export default FolderFeed;
