"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateProductPayload } from "@/schemas/create-product";
import { and, eq } from "drizzle-orm";

export const getProductsByStoreId = async (id: string) => {
  try {
    const storeProducts = await db.query.products.findMany({
      where: eq(products.storeId, id),
      with: {
        productToCategories: {
          with: {
            category: true, // fetch the actual category object
          },
        },
      },
    });

    return storeProducts;
  } catch (error) {
    console.log(error);
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
        name: product.productName.trim(),
        storeId,
        userId: session.user.id,
      })
      .returning();

    return storeProduct[0];
  } catch {
    return null;
  }
};

export const updateProduct = async (
  productId: string,
  data: Partial<CreateProductPayload>
) => {
  const session = await auth();
  if (!session) return null;

  try {
    const updated = await db
      .update(products)
      .set({
        ...data,
        name: data.productName, // normalize field
        // assuming you have this column
      })
      .where(
        and(eq(products.id, productId), eq(products.userId, session.user.id))
      )
      .returning();

    return updated[0];
  } catch {
    return null;
  }
};

// DELETE
export const deleteProduct = async (productId: string) => {
  const session = await auth();
  if (!session) return null;

  try {
    const deleted = await db
      .delete(products)
      .where(
        and(eq(products.id, productId), eq(products.userId, session.user.id))
      )
      .returning();

    return deleted[0];
  } catch {
    return null;
  }
};
