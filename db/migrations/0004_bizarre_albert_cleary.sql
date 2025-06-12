CREATE TABLE "codeVerificationToken" (
	"identifier" text PRIMARY KEY NOT NULL,
	"expires" timestamp NOT NULL,
	"code" text NOT NULL
);
