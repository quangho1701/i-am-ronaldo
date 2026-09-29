import { sqliteTable, text, integer, primaryKey, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const workspaces = sqliteTable("workspaces", {
 ownerId:text("owner_id").primaryKey(),
 document:text("document").notNull(),
 activeSession:text("active_session"),
 revision:integer("revision").notNull().default(0),
 lastMutation:text("last_mutation"),
}, t=>[check("valid_document",sql`json_valid(${t.document})`),check("single_session_object",sql`${t.activeSession} IS NULL OR (json_valid(${t.activeSession}) AND json_type(${t.activeSession}) = 'object')`)]);
export const receipts = sqliteTable("mutation_receipts",{
 ownerId:text("owner_id").notNull(),
 requestId:text("request_id").notNull(),
 fingerprint:text("fingerprint").notNull(),
 revision:integer("revision").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.requestId]})]);
