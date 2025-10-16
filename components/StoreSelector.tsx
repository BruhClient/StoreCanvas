import { auth } from "@/lib/auth";
import { getUserStores } from "@/server/db/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Store } from "lucide-react";
import FlexImage from "./FlexImage";
import Link from "next/link";
import { toSlug } from "@/lib/slug";

const StoreSelector = async () => {
  const session = await auth();
  const userStores = await getUserStores(session?.user.id!);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Store />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        {userStores.map((store) => {
          return (
            <Link href={`/store/${toSlug(store.name)}`} key={store.id}>
              <div
                key={store.id}
                className="w-full flex items-center gap-2 hover:bg-muted p-2 cursor-pointer"
              >
                <FlexImage
                  width={40}
                  height={40}
                  src={
                    store.imageUrl ? store.imageUrl : "/placeholder-image.png"
                  }
                  alt={store.name}
                  rounded="sm"
                />
                <div>
                  <div className="text-sm line-clamp-1 ">{store.name}</div>
                  <div className="text-xs text-muted-foreground ">
                    {store.isOpen ? "Open" : "Closed"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default StoreSelector;
