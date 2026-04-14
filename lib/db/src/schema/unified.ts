import { pgTable, uuid, text, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

// Enums
export const callOutcomeEnum = pgEnum('call_outcome', ['completed', 'no_answer', 'voicemail', 'busy', 'failed']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'unqualified', 'converted']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const listingStatusEnum = pgEnum('listing_status', ['active', 'pending', 'sold', 'withdrawn']);
export const listingSourceEnum = pgEnum('listing_source', ['mls', 'manual', 'import']);
export const integrationStatusEnum = pgEnum('integration_status', ['connected', 'disconnected', 'error']);

// Agent Profiles
export const agentProfilesTable = pgTable("agent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
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

export const insertAgentProfileSchema = z.object({
  fullName: z.string(),
  brokerage: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  serviceAreas: z.string().nullable().optional(),
  escalationContact: z.string().nullable().optional(),
});

export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type AgentProfile = typeof agentProfilesTable.$inferSelect;

// Business Settings
export const businessSettingsTable = pgTable("business_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  appointmentTypes: text("appointment_types"),
  appointmentDuration: integer("appointment_duration"),
  bookingBuffer: integer("booking_buffer"),
  officeHours: text("office_hours"),
  leadRoutingPrefs: text("lead_routing_prefs"),
  handoffRules: text("handoff_rules"),
  transferInstructions: text("transfer_instructions"),
  businessNotes: text("business_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessSettingsSchema = z.object({
  agentId: z.string().uuid(),
  appointmentTypes: z.string().nullable().optional(),
  appointmentDuration: z.number().int().nullable().optional(),
  bookingBuffer: z.number().int().nullable().optional(),
  officeHours: z.string().nullable().optional(),
  leadRoutingPrefs: z.string().nullable().optional(),
  handoffRules: z.string().nullable().optional(),
  transferInstructions: z.string().nullable().optional(),
  businessNotes: z.string().nullable().optional(),
});

export type InsertBusinessSettings = z.infer<typeof insertBusinessSettingsSchema>;
export type BusinessSettings = typeof businessSettingsTable.$inferSelect;

// Onboarding Progress
export const onboardingProgressTable = pgTable("onboarding_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().unique().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  currentStep: integer("current_step").notNull().default(1),
  completedSteps: text("completed_steps").notNull().default("[]"),
  isComplete: boolean("is_complete").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOnboardingProgressSchema = z.object({
  agentId: z.string().uuid(),
  currentStep: z.number().int().optional(),
  completedSteps: z.string().optional(),
  isComplete: z.boolean().optional(),
});

export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;
export type OnboardingProgress = typeof onboardingProgressTable.$inferSelect;

// Leads
export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  source: text("source"),
  status: leadStatusEnum("status").notNull().default('new'),
  intent: text("intent"),
  notes: text("notes"),
  score: integer("score"),
  tags: text("tags"),
  lastContact: timestamp("last_contact"),
  nextFollowUp: timestamp("next_follow_up"),
  conversionProbability: integer("conversion_probability"),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = z.object({
  agentId: z.string().uuid(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'unqualified', 'converted']).optional(),
  intent: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  score: z.number().int().nullable().optional(),
  tags: z.string().nullable().optional(),
  lastContact: z.date().nullable().optional(),
  nextFollowUp: z.date().nullable().optional(),
  conversionProbability: z.number().int().nullable().optional(),
  estimatedValue: z.string().nullable().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

// Listings
export const listingsTable = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  mlsNumber: text("mls_number"),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  price: decimal("price", { precision: 12, scale: 2 }),
  beds: integer("beds"),
  baths: decimal("baths", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  yearBuilt: integer("year_built"),
  propertyType: text("property_type"),
  status: listingStatusEnum("status").notNull().default('active'),
  source: listingSourceEnum("source").notNull().default('manual'),
  description: text("description"),
  features: text("features"),
  images: text("images"),
  virtualTourUrl: text("virtual_tour_url"),
  listingUrl: text("listing_url"),
  daysOnMarket: integer("days_on_market"),
  pricePerSqft: decimal("price_per_sqft", { precision: 8, scale: 2 }),
  publicRemarks: text("public_remarks"),
  privateRemarks: text("private_remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = z.object({
  agentId: z.string().uuid(),
  mlsNumber: z.string().nullable().optional(),
  address: z.string(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  beds: z.number().int().nullable().optional(),
  baths: z.string().nullable().optional(),
  sqft: z.number().int().nullable().optional(),
  lotSize: z.string().nullable().optional(),
  yearBuilt: z.number().int().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  status: z.enum(['active', 'pending', 'sold', 'withdrawn']).optional(),
  source: z.enum(['mls', 'manual', 'import']).optional(),
  description: z.string().nullable().optional(),
  features: z.string().nullable().optional(),
  images: z.string().nullable().optional(),
  virtualTourUrl: z.string().nullable().optional(),
  listingUrl: z.string().nullable().optional(),
  daysOnMarket: z.number().int().nullable().optional(),
  pricePerSqft: z.string().nullable().optional(),
  publicRemarks: z.string().nullable().optional(),
  privateRemarks: z.string().nullable().optional(),
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;

// Appointments
export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  leadId: uuid("lead_id").references(() => leadsTable.id, { onDelete: 'set null' }),
  listingId: uuid("listing_id").references(() => listingsTable.id, { onDelete: 'set null' }),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // in minutes
  status: appointmentStatusEnum("status").notNull().default('scheduled'),
  appointmentType: text("appointment_type"),
  location: text("location"),
  notes: text("notes"),
  reminderSent: boolean("reminder_sent").default(false),
  confirmed: boolean("confirmed").default(false),
  cancellationReason: text("cancellation_reason"),
  rescheduledFrom: uuid("rescheduled_from"),
  googleEventId: text("google_event_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = z.object({
  agentId: z.string().uuid(),
  leadId: z.string().uuid().nullable().optional(),
  listingId: z.string().uuid().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  scheduledAt: z.date(),
  duration: z.number().int().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
  appointmentType: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  reminderSent: z.boolean().optional(),
  confirmed: z.boolean().optional(),
  cancellationReason: z.string().nullable().optional(),
  rescheduledFrom: z.string().uuid().nullable().optional(),
  googleEventId: z.string().nullable().optional(),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;

// Calls
export const callsTable = pgTable("calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  leadId: uuid("lead_id").references(() => leadsTable.id, { onDelete: 'set null' }),
  direction: text("direction").notNull(), // 'inbound' | 'outbound'
  phoneNumber: text("phone_number").notNull(),
  duration: integer("duration"), // in seconds
  outcome: callOutcomeEnum("outcome"),
  summary: text("summary"),
  notes: text("notes"),
  sentiment: text("sentiment"),
  transcript: text("transcript"),
  recordingUrl: text("recording_url"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  tags: text("tags"),
  twilioCallSid: text("twilio_call_sid"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCallSchema = z.object({
  agentId: z.string().uuid(),
  leadId: z.string().uuid().nullable().optional(),
  direction: z.string(),
  phoneNumber: z.string(),
  duration: z.number().int().nullable().optional(),
  outcome: z.enum(['completed', 'no_answer', 'voicemail', 'busy', 'failed']).nullable().optional(),
  summary: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  sentiment: z.string().nullable().optional(),
  transcript: z.string().nullable().optional(),
  recordingUrl: z.string().nullable().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.date().nullable().optional(),
  tags: z.string().nullable().optional(),
  twilioCallSid: z.string().nullable().optional(),
});

export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof callsTable.$inferSelect;

// Voice Settings
export const voiceSettingsTable = pgTable("voice_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().unique().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  phoneNumber: text("phone_number"),
  voiceId: text("voice_id"),
  greeting: text("greeting"),
  personality: text("personality"),
  instructions: text("instructions"),
  allowedActions: text("allowed_actions"),
  escalationBehavior: text("escalation_behavior"),
  isActive: boolean("is_active").default(false),
  callbackUrl: text("callback_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSettingsSchema = z.object({
  agentId: z.string().uuid(),
  phoneNumber: z.string().nullable().optional(),
  voiceId: z.string().nullable().optional(),
  greeting: z.string().nullable().optional(),
  personality: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
  allowedActions: z.string().nullable().optional(),
  escalationBehavior: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  callbackUrl: z.string().nullable().optional(),
});

export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;
export type VoiceSettings = typeof voiceSettingsTable.$inferSelect;

// FAQs
export const faqsTable = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  isActive: boolean("is_active").default(true),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFaqSchema = z.object({
  agentId: z.string().uuid(),
  isActive: z.boolean().optional(),
  question: z.string(),
  answer: z.string(),
  category: z.string().nullable().optional(),
  order: z.number().int().optional(),
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;

// Integrations
export const integrationsTable = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'google_calendar', 'gmail', 'mls', etc.
  status: integrationStatusEnum("status").default('disconnected'),
  settings: text("settings"), // JSON string
  lastSync: timestamp("last_sync"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIntegrationSchema = z.object({
  agentId: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']).optional(),
  settings: z.string().nullable().optional(),
  lastSync: z.date().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
});

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrationsTable.$inferSelect;

// Plan Entitlements
export const planEntitlementsTable = pgTable("plan_entitlements", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().unique().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  isActive: boolean("is_active").default(true),
  planName: text("plan_name"),
  maxLeads: integer("max_leads"),
  maxListings: integer("max_listings"),
  maxCalls: integer("max_calls"),
  hasVoiceAgent: boolean("has_voice_agent").default(false),
  hasCrmIntegrations: boolean("has_crm_integrations").default(false),
  hasAdvancedAnalytics: boolean("has_advanced_analytics").default(false),
  customBranding: boolean("custom_branding").default(false),
  prioritySupport: boolean("priority_support").default(false),
  apiAccess: boolean("api_access").default(false),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlanEntitlementSchema = z.object({
  agentId: z.string().uuid(),
  isActive: z.boolean().optional(),
  planName: z.string().optional(),
  maxLeads: z.number().int().optional(),
  maxListings: z.number().int().optional(),
  maxCalls: z.number().int().optional(),
  hasVoiceAgent: z.boolean().optional(),
  hasCrmIntegrations: z.boolean().optional(),
  hasAdvancedAnalytics: z.boolean().optional(),
  customBranding: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
  apiAccess: z.boolean().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
  currentPeriodStart: z.date().nullable().optional(),
  currentPeriodEnd: z.date().nullable().optional(),
  trialEndsAt: z.date().nullable().optional(),
});

export type InsertPlanEntitlement = z.infer<typeof insertPlanEntitlementSchema>;
export type PlanEntitlement = typeof planEntitlementsTable.$inferSelect;
