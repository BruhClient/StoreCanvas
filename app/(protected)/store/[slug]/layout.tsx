import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { StoreProvider, StoreContextValue } from "@/context/store-context";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import StoreBreadcrumb from "@/components/sidebar/store-breadcrumb";
import { auth } from "@/lib/auth";
import { fromSlug } from "@/lib/slug";
import { getStoreByName } from "@/server/db/stores";
import { getProductsByStoreId } from "@/server/db/products";
import { getProductCategories } from "@/server/db/productCategories";
import { redirect } from "next/navigation";

interface StoreDetailsLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
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
    throw new Error("Store not found or unauthorized"); // optionally redirect
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
    <SidebarProvider>
      <StoreProvider initialData={initialData}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <StoreBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </StoreProvider>
    </SidebarProvider>
  );
};

export default StoreDetailsLayout;
