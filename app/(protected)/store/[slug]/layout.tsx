import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { StoreProvider } from "@/context/store-context";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import StoreBreadcrumb from "@/components/sidebar/store-breadcrumb";
import { auth } from "@/lib/auth";
import { fromSlug } from "@/lib/slug";
import { getStoreByName } from "@/server/db/stores";
import { getProductsByStoreId } from "@/server/db/products";
import { getProductCategories } from "@/server/db/productCategories";
import { redirect } from "next/navigation";
import { ClientSidebar } from "@/components/ClientSidebar";

interface StoreDetailsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export const StoreDetailsLayout = async ({
  children,
  params,
}: StoreDetailsLayoutProps) => {
  const slug = (await params).slug;
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  // fetch everything server-side
  const store = await getStoreByName(fromSlug(slug));
  if (!store || store.ownerId !== session.user.id) {
    redirect("/store");
  }

  const [products, categories] = await Promise.all([
    getProductsByStoreId(store.id),
    getProductCategories(store.id),
  ]);

  const initialData = {
    store,
    products: products ?? [],
    productCategories: categories ?? [],
  };

  return (
    <StoreProvider initialData={initialData}>
      <ClientSidebar>{children}</ClientSidebar>
    </StoreProvider>
  );
};

export default StoreDetailsLayout;
