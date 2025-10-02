import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getStoreByName } from "@/server/db/stores";
import { fromSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { StoreProvider } from "@/context/store-context";
import { auth } from "@/lib/auth";

import { Separator } from "@/components/ui/separator";
import StoreBreadcrumb from "@/components/sidebar/store-breadcrumb";
import { getProductsByStoreId } from "@/server/db/products";
import { getProductCategories } from "@/server/db/productCategories";
const StoreDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const store = await getStoreByName(fromSlug(slug));
  const session = await auth();

  if (!store || store.ownerId !== session?.user.id) {
    redirect("/store/new");
  }

  console.log("THIS IS CALLED");
  const products = await getProductsByStoreId(store.id);

  const productCategories = await getProductCategories(store.id);

  return (
    <SidebarProvider>
      <StoreProvider
        store={store}
        products={products ?? []}
        productCategories={productCategories ?? []}
      >
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
