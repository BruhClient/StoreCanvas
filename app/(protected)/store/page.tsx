import { auth } from "@/lib/auth";
import { toSlug } from "@/lib/slug";
import { getUserStores } from "@/server/db/stores";
import { redirect } from "next/navigation";
import React from "react";

const StorePage = async () => {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const stores = await getUserStores(session.user.id);
  if (!stores || stores.length === 0) {
    redirect("/store/new");
  } else {
    redirect(`/store/${toSlug(stores[0].name)}`);
  }
};

export default StorePage;
