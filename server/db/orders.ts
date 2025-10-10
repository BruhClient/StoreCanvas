"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cacheTag } from "next/cache";

export const getOrders = async (sessionId: string, limit: number) => {
  "use cache";
  unstable_cacheTag("orders-" + sessionId);
  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.saleSessionId, sessionId),
      limit,
    });

    return userOrders;
  } catch {
    return null;
  }
};
