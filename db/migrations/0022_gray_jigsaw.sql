ALTER TABLE "saleSession" ADD COLUMN "accountId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "saleSession" ADD COLUMN "paymentType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "saleSession" ADD CONSTRAINT "saleSession_accountId_paymentCards_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."paymentCards"("id") ON DELETE cascade ON UPDATE no action;