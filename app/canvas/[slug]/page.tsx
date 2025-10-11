import { fromSlug } from "@/lib/slug";
import { getProductCategories } from "@/server/db/productCategories";
import { getProductsByStoreId } from "@/server/db/products";
import { getActiveSaleSession, getSaleSession } from "@/server/db/saleSessions";
import { getStoreByName } from "@/server/db/stores";
import { getUserByEmail, getUserById } from "@/server/db/users";
import React from "react";

const CanvasPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const store = await getStoreByName(fromSlug(slug));

  if (!store) {
    return <div>No store found</div>;
  }

  const [products, categories] = await Promise.all([
    getProductsByStoreId(store.id),
    getProductCategories(store.id),
    getActiveSaleSession(store.id),
    getUserById(store.id),
  ]);

  return <div>CanvasPage</div>;
};

export default CanvasPage;
