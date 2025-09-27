ALTER TABLE "products" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;