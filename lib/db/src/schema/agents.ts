import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agentProfilesTable = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  brokerage: text("brokerage"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  bio: text("bio"),
  serviceAreas: text("service_areas"),
  escalationContact: text("escalation_contact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAgentProfileSchema = createInsertSchema(agentProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type AgentProfile = typeof agentProfilesTable.$inferSelect;

export const businessSettingsTable = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  appointmentTypes: text("appointment_types"),
  appointmentDuration: integer("appointment_duration"),
  bookingBuffer: integer("booking_buffer"),
  officeHours: text("office_hours"),
  leadRoutingPrefs: text("lead_routing_prefs"),
  handoffRules: text("handoff_rules"),
  transferInstructions: text("transfer_instructions"),
  businessNotes: text("business_notes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessSettingsSchema = createInsertSchema(businessSettingsTable).omit({ id: true, updatedAt: true });
export type InsertBusinessSettings = z.infer<typeof insertBusinessSettingsSchema>;
export type BusinessSettings = typeof businessSettingsTable.$inferSelect;

export const onboardingProgressTable = pgTable("onboarding_progress", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().unique(),
  currentStep: integer("current_step").notNull().default(1),
  completedSteps: text("completed_steps").notNull().default("[]"),
  isComplete: boolean("is_complete").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OnboardingProgress = typeof onboardingProgressTable.$inferSelect;
