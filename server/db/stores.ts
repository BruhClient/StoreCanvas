"use server";

import { db } from "@/db";
import {
  orders,
  productCategories,
  products,
  productToCategories,
  stores,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateStorePayload } from "@/schemas/create-store";
import { and, count, eq, InferSelectModel, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { endSaleSession } from "./saleSessions";
import { toSlug } from "@/lib/slug";

export const getCurrentUserStores = async (limit?: number) => {
  const session = await auth();
  if (!session) {
    return [];
  } else {
    try {
      const userStores = await db.query.stores.findMany({
        where: eq(stores.ownerId, session.user.id),
        limit,
      });

      return userStores;
    } catch {
      return [];
    }
  }
};

export const createStore = async (values: CreateStorePayload) => {
  const session = await auth();

  if (!session) return { error: "Unauthorized" };

  const existingStore = await getStoreByName(values.storeName);
  if (existingStore) return { error: "Store name already exists" };

  const {
    storeName,
    additionalFields,
    currency,
    address,
    whatsapp,
    telegram,
    description,
    allowComments,
    imageFile: imageUrl,
    products: updatedProducts,
  } = values;

  try {
    const result = await db.transaction(async (tx) => {
      // 1️⃣ Insert the store
      const [newStore] = await tx
        .insert(stores)
        .values({
          name: storeName,
          additionalFields,
          currency,
          address,
          whatsapp,
          description,
          telegram,
          allowComments,
          imageUrl,
          ownerId: session.user.id,
        })
        .returning({ id: stores.id, name: stores.name });

      // 2️⃣ Insert products
      if (updatedProducts && updatedProducts.length > 0) {
        for (const product of updatedProducts) {
          const { name, price, variants, categories, description, images } =
            product;

          // Insert product
          const [newProduct] = await tx
            .insert(products)
            .values({
              name,
              price,
              images: images ? images : [],
              variants,
              storeId: newStore.id,
              description,
              userId: session.user.id,
            })
            .returning({ id: products.id });

          // Insert product-category links
          if (categories && categories.length > 0) {
            // Ensure all categories exist in productCategories
            const categoryRecords = await Promise.all(
              categories.map(async (catName) => {
                // Try to find existing category
                const existing = await tx
                  .select()
                  .from(productCategories)
                  .where(
                    and(
                      eq(productCategories.name, catName),
                      eq(productCategories.storeId, newStore.id)
                    )
                  )
                  .limit(1);

                if (existing.length > 0) return existing[0];

                // If not exist, create it
                const [newCat] = await tx
                  .insert(productCategories)
                  .values({
                    storeId: newStore.id,
                    name: catName,
                  })
                  .returning({ id: productCategories.id });
                return newCat;
              })
            );

            // Link product to categories
            await tx.insert(productToCategories).values(
              categoryRecords.map((cat) => ({
                productId: newProduct.id,
                categoryId: cat.id,
              }))
            );
          }
        }
      }

      return newStore;
    });

    return { success: "Store successfully created", store: result };
  } catch (err) {
    console.error("Failed to create store:", err);
    return { error: "Failed to create store" };
  }
};

export const getStoreByName = async (name: string) => {
  const store = await db.query.stores.findFirst({
    where: eq(sql`LOWER(${stores.name})`, name.trim().toLowerCase()),
  });

  return store;
};

export const editStore = async (
  id: string,
  fields: Partial<InferSelectModel<typeof stores>>
) => {
  console.log(fields);
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const store = await db
      .update(stores)
      .set(fields)
      .where(and(eq(stores.id, id), eq(stores.ownerId, session.user.id)))
      .returning();

    return {
      success: true,
      data: store[0],
      user: session.user.id,
    };
  } catch {
    return null;
  }
};

export const deleteStore = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const store = await db
      .delete(stores)
      .where(and(eq(stores.id, id), eq(stores.ownerId, session.user.id)))
      .returning();
    return {
      success: true,
      data: store,
    };
  } catch {
    return null;
  }
};

export const closeStore = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }

  try {
    const [updatedStore, endedSession] = await Promise.all([
      db
        .update(stores)
        .set({
          isOpen: false, // closing the store
        })
        .where(and(eq(stores.id, id), eq(stores.ownerId, session.user.id)))
        .returning(),
      endSaleSession(id), // end the active sale session (returns the session)
    ]);

    let orderCount = 0;
    if (endedSession?.id) {
      const [result] = await db
        .select({ value: count() })
        .from(orders)
        .where(eq(orders.saleSessionId, endedSession.id));
      orderCount = result?.value ?? 0;
    }

    revalidatePath(`/store/${toSlug(updatedStore[0].name)}/orders`);

    return {
      success: true,
      data: updatedStore[0], // updated store
      endedSession: {
        ...endedSession,
        orderCount,
      },
    };
  } catch (err) {
    console.error("Failed to close store:", err);
    return null;
  }
};
