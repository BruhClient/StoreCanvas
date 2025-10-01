"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateProductPayload } from "@/schemas/create-product";
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

export const createProduct = async (
  product: CreateProductPayload,
  storeId: string
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const storeProduct = await db
      .insert(products)
      .values({
        ...product,
        name: product.productName,
        storeId,
        userId: session.user.id,
      })
      .returning();

    return storeProduct[0];
  } catch {
    return null;
  }
};
