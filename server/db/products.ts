"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateProductPayload } from "@/schemas/create-product";
import { and, eq } from "drizzle-orm";

function normalizeProduct(product: any) {
  return {
    ...product,
    categories:
      product.productToCategories?.map((pc: any) => pc.category.name) ?? [],
  };
}

export const getProductsByStoreId = async (id: string) => {
  try {
    const storeProducts = await db.query.products.findMany({
      where: eq(products.storeId, id),
      with: {
        productToCategories: {
          with: {
            category: true,
          },
        },
      },
    });

    return storeProducts.map(normalizeProduct);
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
  if (!session) return null;

  try {
    const storeProduct = await db
      .insert(products)
      .values({
        ...product,
        name: product.productName.trim(),
        storeId,
        userId: session.user.id,
      })
      .returning({
        // only fetch product fields
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
      });

    // fetch categories after insert
    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, storeProduct[0].id),
      with: {
        productToCategories: {
          with: { category: true },
        },
      },
    });

    return normalizeProduct(fullProduct);
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
    await db
      .update(products)
      .set({
        ...data,
        name: data.productName,
      })
      .where(
        and(eq(products.id, productId), eq(products.userId, session.user.id))
      );

    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        productToCategories: {
          with: { category: true },
        },
      },
    });

    return fullProduct ? normalizeProduct(fullProduct) : null;
  } catch {
    return null;
  }
};

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

    if (!deleted[0]) return null;

    return { ...deleted[0], categories: [] }; // categories gone after delete
  } catch {
    return null;
  }
};
