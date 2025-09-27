CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"extra_fields" jsonb DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_order_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"field_name" text NOT NULL,
	"field_type" text NOT NULL,
	"options" jsonb DEFAULT 'null'::jsonb,
	"required" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stores" DROP CONSTRAINT "stores_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "ownerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_fields" ADD CONSTRAINT "store_order_fields_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "userId";