import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const voiceSettingsTable = pgTable("voice_settings", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().unique(),
  selectedVoice: text("selected_voice"),
  voiceId: text("voice_id"),
  greeting: text("greeting"),
  personality: text("personality"),
  allowedActions: text("allowed_actions"),
  escalationBehavior: text("escalation_behavior"),
  isActive: boolean("is_active").notNull().default(false),
  vapiAssistantId: text("vapi_assistant_id"),
  linkedPhone: text("linked_phone"),
  phoneNumber: text("phone_number"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSettingsSchema = z.object({
  agentId: z.number().int(),
  selectedVoice: z.string().nullable().optional(),
  greeting: z.string().nullable().optional(),
  personality: z.string().nullable().optional(),
  allowedActions: z.string().nullable().optional(),
  escalationBehavior: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  vapiAssistantId: z.string().nullable().optional(),
  linkedPhone: z.string().nullable().optional(),
});

export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;
export type VoiceSettings = typeof voiceSettingsTable.$inferSelect;
