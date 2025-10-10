"use client";

import { useStore } from "@/context/store-context";
import { orders, saleSessions } from "@/db/schema";
import { useSaleSessions } from "@/hooks/use-sale-sessions";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect } from "react";
import { useIntersection } from "@mantine/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Activity, Clock, CreditCard, Package } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { format } from "date-fns";
import { formatDate, getDuration } from "@/lib/date";
import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import { useOrders } from "@/hooks/use-orders";

const OrderFeed = ({
  initialOrders,
  sessionId,
}: {
  initialOrders: InferSelectModel<typeof orders>[];
  sessionId: string;
}) => {
  const router = useRouter();
  const { orders, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrders({
    sessionId: sessionId,
    initialData: initialOrders,
  });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4 min-h-[300px] w-full session-feed">
      {orders.map((order, idx) => {
        const isLast = idx === order.length - 1;
        const isActive = !order.endedAt;

        return (
          <div
            key={order.id}
            ref={isLast ? ref : undefined}
            className={`border shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer ${
              isActive ? "border-green-400" : "border-gray-200"
            }`}
          >
            {order.id}
          </div>
        );
      })}

      {isFetchingNextPage && (
        <div className="text-center text-gray-500">Loading more…</div>
      )}
    </div>
  );
};

export default OrderFeed;
