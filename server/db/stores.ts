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
import { revalidatePath, revalidateTag, unstable_cacheTag } from "next/cache";
import { endSaleSession } from "./saleSessions";
import { toSlug } from "@/lib/slug";

export const getUserStores = async (userId: string) => {
  "use cache";
  unstable_cacheTag("stores-", userId);
  try {
    const userStores = await db.query.stores.findMany({
      where: eq(stores.ownerId, userId),
    });

    return userStores;
  } catch {
    return [];
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
      revalidateTag("stores-" + session.user.id);
      return newStore;
    });

    return { success: "Store successfully created", store: result };
  } catch (err) {
    console.error("Failed to create store:", err);
    return { error: "Failed to create store" };
  }
};

export const getStoreByName = async (name: string) => {
  "use cache";
  unstable_cacheTag("store-" + name.toLowerCase());
  const store = await db.query.stores.findFirst({
    where: eq(sql`LOWER(${stores.name})`, name.trim().toLowerCase()),
  });
  return store;
};

export const editStore = async (
  id: string,
  fields: Partial<InferSelectModel<typeof stores>>
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    if (fields.name) {
      const orginalStore = await db
        .select({ name: stores.name })
        .from(stores)
        .where(eq(stores.id, id));

      revalidatePath("store-" + orginalStore[0].name.toLowerCase());
    }

    const store = await db
      .update(stores)
      .set(fields)
      .where(and(eq(stores.id, id), eq(stores.ownerId, session.user.id)))
      .returning();

    revalidateTag("store-" + store[0].name?.toLowerCase());

    if (fields.name) {
      revalidateTag("stores-" + session.user.id);
    }
    return {
      success: true,
      data: store[0],
      user: session.user.id,
    };
  } catch (error: any) {
    console.log(error);
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
    revalidateTag("stores-" + session.user.id);
    revalidateTag("store-" + id);
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
    revalidateTag("saleSessions-" + updatedStore[0].id);
    revalidateTag("store-" + updatedStore[0].id);
    revalidatePath(
      `/store/${toSlug(updatedStore[0].name)}/sessions/${endedSession?.id}`
    );
    revalidatePath(`/store/${toSlug(updatedStore[0].name)}/sessions`);

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
