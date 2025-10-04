"use client";
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeletePaymentCardButton from "./DeletePaymentCardButton";

type Props = {
  stripeAccountId: string;
  cardName: string;
  createdAt?: string | Date;
  className?: string;
};

function formatDate(d: string | Date | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return format(date, "dd/MM/yyyy");
}

export default function PaymentCard({
  stripeAccountId,
  cardName,
  createdAt,
  className = "",
}: Props) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>{cardName}</CardTitle>
        <CardDescription>
          <Badge variant="outline">{formatDate(createdAt)}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Account ID:</div>
          <div>{stripeAccountId || "—"}</div>
        </div>

        <DeletePaymentCardButton stripeAccountId={stripeAccountId} />
      </CardContent>
    </Card>
  );
}
