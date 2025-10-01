ALTER TABLE "store_categories" RENAME COLUMN "store_id" TO "storeId";--> statement-breakpoint
ALTER TABLE "store_categories" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "store_categories" DROP CONSTRAINT "store_categories_store_id_store_id_fk";
--> statement-breakpoint
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;