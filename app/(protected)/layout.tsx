import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
