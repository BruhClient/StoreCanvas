import React, { Suspense } from "react";
import StartSaleSessionButton from "./_components/StartSaleSessionDialog";
import { getSaleSessions } from "@/server/db/saleSessions";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { fromSlug } from "@/lib/slug";
import SaleSessionsFeed from "./_components/SaleSessionsFeed";
import { Badge } from "@/components/ui/badge";
import EndSaleSessionButton from "./_components/EndSaleSessionButton";
import { getStoreByName } from "@/server/db/stores";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import OnboardingTour from "@/components/OnboardingTour";

const sessionSteps = [
  {
    target: ".session-feed",
    content: "This is your session feed, where all sessions are displayed.",
    disableBeacon: true,
  },
  {
    target: ".start-session-button",
    content: "Click here to create a new session.",
    disableBeacon: true,
  },
];

const StoreOrdersPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  const store = await getStoreByName(fromSlug(slug));

  if (!store) {
    redirect("/store");
  }
  const saleSessions = await getSaleSessions(store.id, {
    limit: DEFAULT_FETCH_LIMIT,
    offset: 0,
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between w-full items-center">
        {saleSessions.length === 0 || saleSessions[0]?.endedAt ? (
          <>
            <Badge variant={"destructive"}>Your store is closed</Badge>
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
        <OnboardingTour id="sessions" steps={sessionSteps} delay={100} />;
      </div>
    </div>
  );
};

export default StoreOrdersPage;
