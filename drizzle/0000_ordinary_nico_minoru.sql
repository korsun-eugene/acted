CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"oblast" text,
	"eligibility_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partners_code_unique" UNIQUE("code")
);
