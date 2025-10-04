"use client";

import {
  Barcode,
  ChartColumnIncreasing,
  ChevronRight,
  ListOrdered,
  LucideListOrdered,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  Wallet,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import { useStore } from "@/context/store-context";

const platformSidebarButtons = [
  {
    name: "Analytics",
    icon: ChartColumnIncreasing,
    default: true,
  },
  {
    name: "Products",
    icon: Barcode,
  },
  {
    name: "Coupons",
    icon: Tag,
  },
  {
    name: "Orders",
    icon: ShoppingCart,
  },
  {
    name: "Fields",
    icon: ListOrdered,
  },
  {
    name: "Payments",
    icon: Wallet,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export function NavMain() {
  const router = useRouter();
  const { store } = useStore();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {platformSidebarButtons.map((button) => {
          return (
            <SidebarMenuItem
              className="flex items-center gap-2"
              key={button.name}
              onClick={() => {
                if (button.default) {
                  router.push(`/store/${toSlug(store?.name!)}`);
                } else {
                  router.push(
                    `/store/${toSlug(store?.name!)}/${button.name.toLowerCase()}`
                  );
                }
              }}
            >
              <SidebarMenuButton tooltip={button.name}>
                <button.icon />
                <span>{button.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
