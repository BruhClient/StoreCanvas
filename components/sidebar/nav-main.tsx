"use client";

import {
  Barcode,
  ChartColumnIncreasing,
  HandCoins,
  ListOrdered,
  Settings,
  Tag,
  Wallet,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import { useStore } from "@/context/store-context";
import OnboardingTour from "../OnboardingTour";

const sidebarSteps = [
  {
    target: ".nav-analytics",
    content: "This is your analytics dashboard where you can view key metrics.",
    disableBeacon: true, // start immediately without waiting for click
  },
  {
    target: ".nav-products",
    content:
      "Manage all your products here, add new ones or edit existing items.",
    disableBeacon: true,
  },
  {
    target: ".nav-sessions",
    content: "Check your sessions and sales data here.",
    disableBeacon: true,
  },
  {
    target: ".nav-fields",
    content:
      "Create custom fields to collect additional information from your customers",
    disableBeacon: true,
  },
  {
    target: ".nav-payments",
    content: "View and create payment options.",
    disableBeacon: true,
  },
  {
    target: ".nav-settings",
    content: "Configure your store settings, integrations, and preferences.",
    disableBeacon: true,
  },
];

const platformSidebarButtons = [
  {
    name: "Analytics",
    icon: ChartColumnIncreasing,
    default: true,
    className: "nav-analytics",
  },
  {
    name: "Products",
    icon: Barcode,
    className: "nav-products",
  },
  {
    name: "Sessions",
    icon: HandCoins,
    className: "nav-sessions",
  },
  {
    name: "Fields",
    icon: ListOrdered,
    className: "nav-fields",
  },
  {
    name: "Payments",
    icon: Wallet,
    className: "nav-payments",
  },
  {
    name: "Settings",
    icon: Settings,
    className: "nav-settings",
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
              <SidebarMenuButton
                tooltip={button.name}
                className={button.className}
              >
                <button.icon />
                <span>{button.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <OnboardingTour id="sidebar" steps={sidebarSteps} />
    </SidebarGroup>
  );
}
