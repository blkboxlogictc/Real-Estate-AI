import { pgTable, uuid, text, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

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

export const insertAgentProfileSchema = createInsertSchema(agentProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
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

export const insertBusinessSettingsSchema = createInsertSchema(businessSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
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

export const insertOnboardingProgressSchema = createInsertSchema(onboardingProgressTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;
export type OnboardingProgress = typeof onboardingProgressTable.$inferSelect;

// Leads
export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  status: leadStatusEnum("status").notNull().default('new'),
  source: text("source"),
  notes: text("notes"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  priority: integer("priority").default(1),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

// Listings
export const listingsTable = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  mlsNumber: text("mls_number").unique(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  squareFeet: integer("square_feet"),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  yearBuilt: integer("year_built"),
  propertyType: text("property_type"),
  description: text("description"),
  features: text("features"),
  images: text("images"),
  status: listingStatusEnum("status").notNull().default('active'),
  source: listingSourceEnum("source").notNull().default('manual'),
  listingDate: timestamp("listing_date"),
  expirationDate: timestamp("expiration_date"),
  soldDate: timestamp("sold_date"),
  soldPrice: decimal("sold_price", { precision: 10, scale: 2 }),
  daysOnMarket: integer("days_on_market"),
  showingInstructions: text("showing_instructions"),
  privateRemarks: text("private_remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true });
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
  appointmentType: text("appointment_type").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull().default(60),
  location: text("location"),
  attendeeNames: text("attendee_names"),
  attendeeEmails: text("attendee_emails"),
  attendeePhones: text("attendee_phones"),
  status: appointmentStatusEnum("status").notNull().default('scheduled'),
  reminderSent: boolean("reminder_sent").notNull().default(false),
  notes: text("notes"),
  outcome: text("outcome"),
  googleEventId: text("google_event_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;

// Calls
export const callsTable = pgTable("calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  leadId: uuid("lead_id").references(() => leadsTable.id, { onDelete: 'set null' }),
  phoneNumber: text("phone_number").notNull(),
  direction: text("direction").notNull(),
  duration: integer("duration"),
  outcome: callOutcomeEnum("outcome").notNull(),
  notes: text("notes"),
  recording: text("recording"),
  transcript: text("transcript"),
  sentiment: text("sentiment"),
  summary: text("summary"),
  actionItems: text("action_items"),
  vapiCallId: text("vapi_call_id"),
  twilioCallSid: text("twilio_call_sid"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCallSchema = createInsertSchema(callsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof callsTable.$inferSelect;

// Voice Settings
export const voiceSettingsTable = pgTable("voice_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().unique().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  voiceId: text("voice_id"),
  phoneNumber: text("phone_number"),
  greeting: text("greeting"),
  vapiAssistantId: text("vapi_assistant_id"),
  vapiPhoneNumberId: text("vapi_phone_number_id"),
  twilioPhoneNumberSid: text("twilio_phone_number_sid"),
  isActive: boolean("is_active").notNull().default(false),
  maxCallDuration: integer("max_call_duration").default(1800),
  callbackUrl: text("callback_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSettingsSchema = createInsertSchema(voiceSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;
export type VoiceSettings = typeof voiceSettingsTable.$inferSelect;

// FAQs
export const faqsTable = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFaqSchema = createInsertSchema(faqsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;

// Integrations
export const integrationsTable = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: integrationStatusEnum("status").notNull().default('disconnected'),
  settings: text("settings"),
  lastSync: timestamp("last_sync"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIntegrationSchema = createInsertSchema(integrationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrationsTable.$inferSelect;

// Plan Entitlements 
export const planEntitlementsTable = pgTable("plan_entitlements", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().unique().references(() => agentProfilesTable.id, { onDelete: 'cascade' }),
  planName: text("plan_name").notNull().default('starter'),
  maxLeads: integer("max_leads").notNull().default(100),
  maxListings: integer("max_listings").notNull().default(10),
  maxCalls: integer("max_calls").notNull().default(50),
  hasVoiceAgent: boolean("has_voice_agent").notNull().default(false),
  hasAdvancedAnalytics: boolean("has_advanced_analytics").notNull().default(false),
  hasApiAccess: boolean("has_api_access").notNull().default(false),
  customBranding: boolean("custom_branding").notNull().default(false),
  stripePriceId: text("stripe_price_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  billingPeriod: text("billing_period").default('monthly'),
  trialEndsAt: timestamp("trial_ends_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlanEntitlementSchema = createInsertSchema(planEntitlementsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlanEntitlement = z.infer<typeof insertPlanEntitlementSchema>;
export type PlanEntitlement = typeof planEntitlementsTable.$inferSelect;

