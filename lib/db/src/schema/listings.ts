import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  address: text("address").notNull(),
  price: numeric("price"),
  beds: integer("beds"),
  baths: numeric("baths"),
  sqft: integer("sqft"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  source: text("source").notNull().default("manual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
