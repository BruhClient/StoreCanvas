"use server";

import { db } from "@/db";
import { paymentCards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { Store } from "lucide-react";
import { revalidateTag, unstable_cacheTag } from "next/cache";

export const getPaymentCards = async (userId: string) => {
  "use cache";
  unstable_cacheTag("paymentCards-" + userId);

  try {
    const cards = await db.query.paymentCards.findMany({
      where: eq(paymentCards.userId, userId),
    });
    return cards;
  } catch {
    return null;
  }
};

export const deletePaymentCard = async (stripeAccountId: string) => {
  const session = await auth();
  if (!session) return null;

  try {
    const deleted = await db
      .delete(paymentCards)
      .where(
        and(
          eq(paymentCards.id, stripeAccountId),
          eq(paymentCards.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted[0]) return null;
    revalidateTag("paymentCards-" + deleted[0].userId);
    return { ...deleted[0], categories: [] }; // categories gone after delete
  } catch {
    return null;
  }
};
