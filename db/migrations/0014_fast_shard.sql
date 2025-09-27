CREATE TABLE "productToCategories" (
	"productId" text NOT NULL,
	"categoryId" text NOT NULL,
	CONSTRAINT "productToCategories_productId_categoryId_pk" PRIMARY KEY("productId","categoryId")
);
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_categoryId_productCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "variants" jsonb;--> statement-breakpoint
ALTER TABLE "productToCategories" ADD CONSTRAINT "productToCategories_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productToCategories" ADD CONSTRAINT "productToCategories_categoryId_productCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."productCategory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "categoryId";