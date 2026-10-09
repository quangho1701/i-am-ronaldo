CREATE TABLE "mutation_receipts" (
	"owner_id" text NOT NULL,
	"request_id" text NOT NULL,
	"fingerprint" text NOT NULL,
	"revision" integer NOT NULL,
	CONSTRAINT "mutation_receipts_owner_id_request_id_pk" PRIMARY KEY("owner_id","request_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"owner_id" text PRIMARY KEY NOT NULL,
	"document" text NOT NULL,
	"active_session" text,
	"revision" integer DEFAULT 0 NOT NULL,
	"last_mutation" text,
	CONSTRAINT "valid_document" CHECK (("workspaces"."document")::jsonb IS NOT NULL),
	CONSTRAINT "single_session_object" CHECK ("workspaces"."active_session" IS NULL OR jsonb_typeof(("workspaces"."active_session")::jsonb) = 'object')
);
