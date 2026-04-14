import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFaqSchema = z.object({
  agentId: z.number().int(),
  question: z.string(),
  answer: z.string(),
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;
