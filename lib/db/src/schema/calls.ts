import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const callsTable = pgTable("calls", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  callerName: text("caller_name"),
  callerPhone: text("caller_phone"),
  duration: integer("duration"),
  outcome: text("outcome"),
  summary: text("summary"),
  transcript: text("transcript"),
  extractedLeadId: integer("extracted_lead_id"),
  calledAt: timestamp("called_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCallSchema = createInsertSchema(callsTable).omit({ id: true, createdAt: true });
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof callsTable.$inferSelect;
