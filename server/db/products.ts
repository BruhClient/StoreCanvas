"use server";

import { db } from "@/db";
import { productCategories, products, productToCategories } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateProductPayload } from "@/schemas/create-product";
import { and, eq } from "drizzle-orm";
import { revalidateTag, unstable_cacheTag } from "next/cache";

function normalizeProduct(product: any) {
  return {
    ...product,
    categories:
      product.productToCategories?.map((pc: any) => pc.category.name) ?? [],
  };
}

export const getProductsByStoreId = async (id: string) => {
  "use cache";
  unstable_cacheTag("products-" + id);
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

    const productId = storeProduct[0].id;

    // 2️⃣ Insert categories if provided
    if (product.categories && product.categories.length > 0) {
      // Fetch IDs for each category name
      const categoryIds = await Promise.all(
        product.categories.map(async (nameOrId) => {
          // If it's already an ID, return it; otherwise fetch by name
          if (typeof nameOrId === "string") {
            const cat = await db.query.productCategories.findFirst({
              where: eq(productCategories.name, nameOrId),
            });
            if (!cat) throw new Error(`Category "${nameOrId}" does not exist`);
            return cat.id;
          }
          return nameOrId;
        })
      );

      // Insert links
      const categoryLinks = categoryIds.map((categoryId) => ({
        productId,
        categoryId,
      }));

      await db.insert(productToCategories).values(categoryLinks);
    }

    // fetch categories after insert
    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, storeProduct[0].id),
      with: {
        productToCategories: {
          with: { category: true },
        },
      },
    });

    revalidateTag("products-" + storeId);
    return normalizeProduct(fullProduct);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateProduct = async (
  productId: string,
  data: Partial<CreateProductPayload> & { categories?: string[] } // categories are productCategory IDs
) => {
  const session = await auth();
  if (!session) return null;

  try {
    // 1️⃣ Update the main product fields (excluding categories)
    const { categories, ...productData } = data;
    const product = await db.query.products.findFirst({
      columns: { storeId: true }, // only select storeId
      where: eq(products.id, productId),
    });
    if (Object.keys(productData).length > 0) {
      await db
        .update(products)
        .set(productData)
        .where(
          and(eq(products.id, productId), eq(products.userId, session.user.id))
        );
    }

    // 2️⃣ Handle categories if provided
    if (categories) {
      // Delete old links
      await db
        .delete(productToCategories)
        .where(eq(productToCategories.productId, productId));

      // Insert new links
      if (categories.length > 0) {
        // Fetch the IDs of the categories by name
        const categoryRecords = await Promise.all(
          categories.map(async (name) => {
            const cat = await db.query.productCategories.findFirst({
              where: eq(productCategories.name, name),
            });
            if (!cat) throw new Error(`Category "${name}" does not exist`);
            return cat.id;
          })
        );

        // Insert links into productToCategories
        const newLinks = categoryRecords.map((categoryId) => ({
          productId,
          categoryId,
        }));

        await db.insert(productToCategories).values(newLinks);
      }
    }

    // 3️⃣ Return the full updated product including categories
    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        productToCategories: {
          with: { category: true },
        },
      },
    });
    revalidateTag("products-" + product?.storeId);
    return fullProduct ? normalizeProduct(fullProduct) : null;
  } catch (err) {
    console.error(err);
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

    revalidateTag("products-" + deleted[0].storeId);
    return { ...deleted[0], categories: [] }; // categories gone after delete
  } catch {
    return null;
  }
};
