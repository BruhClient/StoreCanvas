"use server";

import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidateTag, unstable_cacheTag } from "next/cache";

export const getProductCategories = async (storeId: string) => {
  "use cache";
  unstable_cacheTag("productCategories-" + storeId);
  try {
    const categories = await db.query.productCategories.findMany({
      where: eq(productCategories.storeId, storeId),
    });

    return categories.map((category) => category.name);
  } catch {
    return null;
  }
};

export const addProductCategory = async (name: string, storeId: string) => {
  try {
    const category = await db
      .insert(productCategories)
      .values({
        storeId,
        name,
      })
      .returning();
    revalidateTag("productCategories-" + storeId);
    return category[0];
  } catch {
    return null;
  }
};

export const deleteProductCategory = async (name: string, storeId: string) => {
  try {
    const category = await db
      .delete(productCategories)
      .where(
        and(
          eq(productCategories.name, name),
          eq(productCategories.storeId, storeId)
        )
      )
      .returning();
    revalidateTag("productCategories-" + category[0].storeId);
    return category[0];
  } catch {
    return null;
  }
};
