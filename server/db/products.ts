"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export const getProductsByStoreName = async (
  name: string,
  offset?: number,
  limit?: number
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const storeProducts = await db.query.products.findMany({
      where: and(eq(products.name, name), eq(products.userId, session.user.id)),
      offset,
      limit,
    });

    return storeProducts;
  } catch {
    return null;
  }
};
