"use server";

import { db } from "@/db";
import { orders, products, saleSessions, stores } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateSaleSessionPayload } from "@/schemas/create-sale-session";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { getStoreByName } from "./stores";
import { toSlug } from "@/lib/slug";

export const createSaleSession = async (
  storeId: string,
  values: CreateSaleSessionPayload
) => {
  try {
    const activeSaleSession = await db.query.saleSessions.findFirst({
      where: and(
        eq(saleSessions.storeId, storeId),
        isNull(saleSessions.endedAt)
      ),
    });

    if (activeSaleSession) {
      throw Error("There is already a active sale session");
    }

    const [{ count: productCount }] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.storeId, storeId));

    if (productCount === 0) {
      throw Error("Your store has no products");
    }
    const [newSession, updatedStore] = await Promise.all([
      db
        .insert(saleSessions)
        .values({
          storeId,
          ...values,
        })
        .returning(),

      db
        .update(stores)
        .set({
          isOpen: true,
        })
        .where(eq(stores.id, storeId))
        .returning(), // only update this store
    ]);

    const createdSession = {
      ...newSession[0],
      orderCount: 0, // newly created session always starts with 0 orders
    };

    revalidatePath(`/store/${toSlug(updatedStore[0].name)}/orders`);

    return {
      success: true,
      session: createdSession,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};

export const getSaleSessions = async (
  storeName: string,
  { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}
) => {
  try {
    const store = await getStoreByName(storeName);

    if (!store) {
      throw new Error("Could not find store by storeName");
    }

    const sessions = await db
      .select({
        id: saleSessions.id,
        storeId: saleSessions.storeId,
        accountId: saleSessions.accountId,
        startedAt: saleSessions.startedAt,
        endedAt: saleSessions.endedAt,
        paymentType: saleSessions.paymentType,
        orderCount: sql<number>`COUNT(${orders.id})`.as("orderCount"),
      })
      .from(saleSessions)
      .leftJoin(orders, eq(orders.saleSessionId, saleSessions.id))
      .where(eq(saleSessions.storeId, store.id))
      .groupBy(
        saleSessions.id,
        saleSessions.storeId,
        saleSessions.accountId,
        saleSessions.startedAt,
        saleSessions.endedAt,
        saleSessions.paymentType
      )
      .orderBy(desc(saleSessions.startedAt))
      .limit(limit)
      .offset(offset);

    return sessions;
  } catch (error: any) {
    console.error("getSaleSessions error:", error.message);
    return [];
  }
};

export const endSaleSession = async (storeId: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }

  try {
    const [endedSession] = await db
      .update(saleSessions)
      .set({
        endedAt: new Date(), // correct way to set current time
      })
      .where(
        and(
          eq(saleSessions.storeId, storeId),
          isNull(saleSessions.endedAt) // only end active sessions
        )
      )
      .returning(); // returns array of updated rows

    return endedSession || null;
  } catch (err) {
    console.error("Failed to end sale session:", err);
    return null;
  }
};
