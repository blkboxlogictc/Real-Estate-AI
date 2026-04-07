import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const voiceSettingsTable = pgTable("voice_settings", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().unique(),
  selectedVoice: text("selected_voice"),
  greeting: text("greeting"),
  personality: text("personality"),
  allowedActions: text("allowed_actions"),
  escalationBehavior: text("escalation_behavior"),
  isActive: boolean("is_active").notNull().default(false),
  vapiAssistantId: text("vapi_assistant_id"),
  linkedPhone: text("linked_phone"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSettingsSchema = createInsertSchema(voiceSettingsTable).omit({ id: true, updatedAt: true });
export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;
export type VoiceSettings = typeof voiceSettingsTable.$inferSelect;
