"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Star, Store } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getCurrentUserStores } from "@/server/db/stores";
import { useRouter } from "next/navigation";
import { formatLongDate } from "@/lib/date";
import { toSlug } from "@/lib/slug";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import useSessionUser from "@/hooks/use-session-user";
import { Skeleton } from "../ui/skeleton";
import { useStore } from "@/context/store-context";

export function StoreSwitcher({}: {}) {
  const { isMobile } = useSidebar();

  const user = useSessionUser();
  const { data, isLoading } = useQuery({
    queryKey: ["userStores", user?.id],
    queryFn: async () => {
      const stores = await getCurrentUserStores();

      if (!stores) return [];
      return stores;
    },
    enabled: !!user,
  });

  const router = useRouter();
  const { store, isFetching } = useStore();
  if (isLoading || !data || isFetching) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2 w-full"
            >
              {/* Icon container always visible */}
              <div className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 relative">
                {store!.imageUrl ? (
                  <Image
                    src={store!.imageUrl}
                    alt={store!.name || "store image"}
                    fill
                    className="object-cover"
                    sizes="100%"
                  />
                ) : (
                  <Store className="size-4" />
                )}
              </div>

              {/* Label container collapsible */}
              <div className="flex-1 flex flex-col text-left text-sm leading-tight overflow-hidden transition-all duration-200 min-w-0">
                <span className="font-medium truncate">{store!.name}</span>
                <span className="text-xs truncate">
                  {formatLongDate(store!.createdAt)}
                </span>
              </div>

              {/* Dropdown chevron */}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Stores
            </DropdownMenuLabel>
            {data!.map((userStore, index) => (
              <DropdownMenuItem
                key={userStore.name}
                onClick={() => {
                  if (!store || !userStore) return;

                  // Only redirect if different store
                  if (store.name !== userStore.name) {
                    // Get the current path after /store/[storeName]
                    const pathParts = window.location.pathname
                      .split("/")
                      .slice(3);
                    // window.location.pathname: /store/currentStoreName/products
                    // slice(3) removes ['', 'store', 'currentStoreName'], leaving ['products']

                    const subPath = pathParts.join("/"); // 'products' or 'orders/123'

                    // Push new URL with same subpath
                    router.push(
                      `/store/${toSlug(userStore.name)}${subPath ? "/" + subPath : ""}`
                    );
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="relative size-6 rounded-md border overflow-hidden">
                  {userStore?.imageUrl ? (
                    <Image
                      src={userStore.imageUrl}
                      alt={userStore.name || "store image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Store className="size-3.5 shrink-0" />
                    </div>
                  )}
                </div>

                {userStore.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push("/store/new")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
