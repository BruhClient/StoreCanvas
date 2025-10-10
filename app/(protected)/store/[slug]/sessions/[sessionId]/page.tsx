import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { formatDate, getDuration } from "@/lib/date";
import { toSlug } from "@/lib/slug";
import { getOrders } from "@/server/db/orders";
import { getSaleSession } from "@/server/db/saleSessions";
import { redirect } from "next/navigation";
import OrdersFeed from "./_components/OrdersFeed";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CreditCard, Wallet } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; slug: string }>;
}) => {
  const { slug, sessionId } = await params;

  const session = await getSaleSession(sessionId);

  if (!session) {
    redirect(`/store/${toSlug(slug)}/sessions`);
  }

  const orders = await getOrders(sessionId, DEFAULT_FETCH_LIMIT);

  if (!orders) {
    redirect(`/store/${toSlug(slug)}/sessions`);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardDescription className="flex gap-2 items-center font-medium text-sm">
              <CreditCard size={15} /> Payment Account Id
            </CardDescription>
            <CardTitle>{session.accountId}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex gap-2 items-center font-medium text-sm">
              <Wallet size={15} /> Payment Type
            </CardDescription>
            <CardTitle>{capitalizeFirstLetter(session.paymentType)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex gap-2 items-center font-medium text-sm">
              <Clock size={15} /> {formatDate(session.startedAt)} -{" "}
              {formatDate(session.endedAt)}
            </CardDescription>
            <CardTitle className="flex items-center gap-2">
              {getDuration(session.startedAt, session.endedAt)}{" "}
              {!session.endedAt && <Badge variant={"outline"}>Active</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <OrdersFeed initialOrders={orders} sessionId={sessionId} />
    </div>
  );
};

export default page;
