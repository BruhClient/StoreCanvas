"use client";
import { getCurrentUserStores } from "@/server/db/stores";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import Image from "next/image";
import { Store } from "lucide-react";
import Link from "next/link";
import { toSlug } from "@/lib/slug";
import { useQuery } from "@tanstack/react-query";
import useSessionUser from "@/hooks/use-session-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { InferSelectModel } from "drizzle-orm";
import { stores } from "@/db/schema";

const StoreSelector = () => {
  const user = useSessionUser();
  const { data } = useQuery({
    queryKey: ["userStores", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");

      return res.json();
    },
    enabled: !!user,
  });
  console.log(data);
  if (data && data?.length > 0) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <Store size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4">
            {data.map((store: InferSelectModel<typeof stores>) => (
              <Link
                href={`/store/${toSlug(store.name)}`}
                key={store.id}
                className="flex gap-2  items-center text-sm font-bold"
              >
                {store.imageUrl ? (
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={store.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                ) : (
                  <Store size={20} className="bg-primary p-1 rounded-full" />
                )}{" "}
                <div className="line-clamp-1">{store.name}</div>
              </Link>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
};

export default StoreSelector;
