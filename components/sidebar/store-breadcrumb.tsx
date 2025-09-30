"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function StoreBreadcrumb() {
  const pathname = usePathname(); // e.g., /store/mystore/products/cheeseburger

  // Split the path into segments
  const segments = pathname.split("/").filter(Boolean); // ['store', 'mystore', 'products', 'cheeseburger']

  // First segment after store name is Analytics
  const breadcrumbSegments = [...segments.slice(2)];

  if (breadcrumbSegments.length === 0) {
    breadcrumbSegments.push("Analytics");
  }

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 3).join("/");
          const isLast = index === breadcrumbSegments.length - 1;
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {capitalize(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
