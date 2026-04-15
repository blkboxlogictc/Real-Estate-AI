import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  address: text("address").notNull(),
  price: text("price"),
  beds: integer("beds"),
  baths: text("baths"),
  bathrooms: text("bathrooms"),
  sqft: integer("sqft"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  source: text("source").notNull().default("manual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = z.object({
  agentId: z.number().int(),
  address: z.string(),
  price: z.string().nullable().optional(),
  beds: z.number().int().nullable().optional(),
  baths: z.string().nullable().optional(),
  sqft: z.number().int().nullable().optional(),
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
  source: z.string().optional(),
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
