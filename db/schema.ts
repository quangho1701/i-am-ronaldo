import { pgTable, text, integer, primaryKey, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const workspaces = pgTable("workspaces", {
 ownerId:text("owner_id").primaryKey(),
 document:text("document").notNull(),
 activeSession:text("active_session"),
 revision:integer("revision").notNull().default(0),
 lastMutation:text("last_mutation"),
}, t=>[check("valid_document",sql`(${t.document})::jsonb IS NOT NULL`),check("single_session_object",sql`${t.activeSession} IS NULL OR jsonb_typeof((${t.activeSession})::jsonb) = 'object'`)]);
export const receipts = pgTable("mutation_receipts",{
 ownerId:text("owner_id").notNull(),
 requestId:text("request_id").notNull(),
 fingerprint:text("fingerprint").notNull(),
 revision:integer("revision").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.requestId]})]);
