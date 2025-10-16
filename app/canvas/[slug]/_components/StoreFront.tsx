import FlexImage from "@/components/FlexImage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { stores, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";
import { Info, Instagram, ShoppingCart } from "lucide-react";
import DialogButton from "@/components/DialogButton";
import { PiTelegramLogo, PiTiktokLogo } from "react-icons/pi";

const socialIcons = {
  instagram: Instagram,
};
const StoreFront = ({
  store,
  user,
  next,
}: {
  store: InferSelectModel<typeof stores>;
  user: InferSelectModel<typeof users>;
  next: () => void;
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl shadow-lg border border-border overflow-hidden relative">
        {/* Card Header: Image + Store Info */}
        <CardHeader className="flex flex-col items-center gap-4 py-6">
          <div className="w-44 h-44 rounded-2xl overflow-hidden ring-1 ring-muted/20 hover:scale-105 transition-transform duration-300">
            <FlexImage
              src={store.imageUrl || "/placeholder-image.png"}
              alt={store.name}
              width="100%"
              height="100%"
              aspectRatio="1/1"
              rounded="2xl"
            />
          </div>

          <CardTitle className="text-2xl text-center">{store.name}</CardTitle>

          <div className="flex items-center gap-2 mt-2">
            {user.image ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.image} alt={user.id} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-xs text-muted-foreground">
              Managed by <span className="font-medium">{user.name}</span>
            </span>
          </div>
        </CardHeader>

        {/* Card Content: Buttons */}
        <CardContent className="flex flex-col gap-3 pt-0">
          <Button
            size="lg"
            className="w-full font-medium flex items-center justify-center gap-2"
            onClick={() => next()}
            disabled={!store.isOpen}
          >
            <ShoppingCart className="w-4 h-4" />
            {store.isOpen ? "Start Ordering" : "Store is Closed"}
          </Button>
          <DialogButton
            buttonContent={
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                About Us
              </Button>
            }
            title={store.name}
            description={store.description ?? "Store description not found"}
          >
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {store.phoneNumber && (
                  <div>Phone Number : {store.phoneNumber}</div>
                )}
                {store.phoneNumber && <div>Address: {store.address}</div>}
              </div>
              <div className="w-full flex gap-2 flex-wrap">
                {store.instagram && (
                  <Button size={"icon"} variant={"outline"}>
                    <Instagram />
                  </Button>
                )}
                {store.tiktok && (
                  <Button size={"icon"} variant={"outline"}>
                    <PiTiktokLogo />
                  </Button>
                )}
                {store.telegram && (
                  <Button size={"icon"} variant={"outline"}>
                    <PiTelegramLogo />
                  </Button>
                )}
              </div>
            </div>
          </DialogButton>
        </CardContent>

        <CardFooter className="pt-0" />
      </Card>
    </div>
  );
};

export default StoreFront;
