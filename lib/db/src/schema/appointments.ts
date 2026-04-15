import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  leadId: integer("lead_id"),
  leadName: text("lead_name"),
  type: text("type"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("upcoming"),
  source: text("source"),
  notes: text("notes"),
  calendarSynced: boolean("calendar_synced").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = z.object({
  agentId: z.number().int(),
  leadId: z.number().int().nullable().optional(),
  leadName: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  scheduledAt: z.date(),
  status: z.string().optional(),
  source: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  calendarSynced: z.boolean().optional(),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
