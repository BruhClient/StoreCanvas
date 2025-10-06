import React, { Suspense } from "react";
import StartSaleSessionButton from "./_components/StartSaleSessionDialog";
import { getSaleSessions } from "@/server/db/saleSessions";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { fromSlug } from "@/lib/slug";
import SaleSessionsFeed from "./_components/SaleSessionsFeed";
import { Badge } from "@/components/ui/badge";
import EndSaleSessionButton from "./_components/EndSaleSessionButton";

const StoreOrdersPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  const saleSessions = await getSaleSessions(fromSlug(slug), {
    limit: DEFAULT_FETCH_LIMIT,
    offset: 0,
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between w-full items-center">
        {saleSessions[0].endedAt ? (
          <>
            <Badge variant={"destructive"}>Your store is cloed</Badge>
            <StartSaleSessionButton />
          </>
        ) : (
          <>
            <Badge variant={"outline"}>Your store is open</Badge>
            <EndSaleSessionButton />
          </>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-lg font-bold">Previous Sessions</div>
          <div className="text-sm text-muted-foreground">
            View all previous sessions and orders
          </div>
        </div>

        <SaleSessionsFeed initialSaleSessions={saleSessions ?? []} />
      </div>
    </div>
  );
};

export default StoreOrdersPage;
