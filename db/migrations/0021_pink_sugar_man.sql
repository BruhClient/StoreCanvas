CREATE TABLE "saleSession" (
	"id" text PRIMARY KEY NOT NULL,
	"storeId" text NOT NULL,
	"startedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"endedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "saleSessionId" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "isOpen" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "saleSession" ADD CONSTRAINT "saleSession_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_saleSessionId_saleSession_id_fk" FOREIGN KEY ("saleSessionId") REFERENCES "public"."saleSession"("id") ON DELETE set null ON UPDATE no action;