ALTER TABLE "products" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price" real NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "allowComments" boolean DEFAULT false;