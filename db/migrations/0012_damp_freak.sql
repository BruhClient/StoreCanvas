CREATE TABLE "store_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "storeOrderField" CASCADE;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "telegram" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "phoneNumber" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "whatsapp" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "additonalFields" jsonb;--> statement-breakpoint
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;