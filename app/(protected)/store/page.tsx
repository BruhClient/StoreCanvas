import { toSlug } from "@/lib/slug";
import { getCurrentUserStores } from "@/server/db/stores";
import { redirect } from "next/navigation";
import React from "react";

const StorePage = async () => {
  const stores = await getCurrentUserStores();
  if (!stores || stores.length === 0) {
    redirect("/store/new");
  } else {
    redirect(`/store/${toSlug(stores[0].name)}`);
  }
};

export default StorePage;
