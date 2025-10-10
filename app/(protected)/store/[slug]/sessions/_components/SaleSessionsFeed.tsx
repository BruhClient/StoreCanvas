"use client";

import { useStore } from "@/context/store-context";
import { saleSessions } from "@/db/schema";
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

const SaleSessionsFeed = ({
  initialSaleSessions,
}: {
  initialSaleSessions: InferSelectModel<typeof saleSessions>[];
}) => {
  const { store } = useStore();
  const router = useRouter();
  const { saleSessions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSaleSessions({
      storeId: store.id,
      initialData: initialSaleSessions,
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
      {saleSessions.map((session, idx) => {
        const isLast = idx === saleSessions.length - 1;
        const isActive = !session.endedAt;

        return (
          <Card
            key={session.id}
            ref={isLast ? ref : undefined}
            onClick={() => {
              router.push(
                `/store/${toSlug(store.name)}/sessions/${session.id}`
              );
            }}
            className={`border shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer ${
              isActive ? "border-green-400" : "border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle>
                {isActive ? "Active Session" : "Completed Session"}{" "}
              </CardTitle>
              <CardDescription>
                {getDuration(session.startedAt, session.endedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Started: {formatDate(session.startedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Ended: {formatDate(session.endedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>{session.orderCount} orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                <span>
                  Payment Type: {capitalizeFirstLetter(session.paymentType)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {isFetchingNextPage && (
        <div className="text-center text-gray-500">Loading more…</div>
      )}
    </div>
  );
};

export default SaleSessionsFeed;
