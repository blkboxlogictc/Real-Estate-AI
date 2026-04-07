-- ============================================================
-- Real Estate AI Assistant (REAA) — Supabase SQL Schema
-- Migration: 001_initial_schema.sql
--
-- MULTI-TENANT ARCHITECTURE:
-- Every table that holds agent data has an `agent_id` column
-- that references auth.users(id) (Supabase auth UUID).
-- Row-Level Security (RLS) ensures each agent can only see
-- and modify their own rows.
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. AGENT PROFILES
--    One row per user. agent_id references auth.users(id).
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id      UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  brokerage     TEXT,
  email         TEXT NOT NULL,
  phone         TEXT,
  bio           TEXT,
  service_areas TEXT,
  escalation_contact TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agent_profiles_agent_id_idx ON agent_profiles(agent_id);

-- ============================================================
-- 2. BUSINESS SETTINGS
--    One row per agent; stores scheduling rules and preferences.
-- ============================================================
CREATE TABLE IF NOT EXISTS business_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id              UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_types     TEXT,           -- comma-separated list
  appointment_duration  INTEGER,        -- minutes
  booking_buffer        INTEGER,        -- minutes between appointments
  office_hours          TEXT,           -- free-text or JSON string
  lead_routing_prefs    TEXT,           -- e.g. "immediate", "business_hours"
  handoff_rules         TEXT,
  transfer_instructions TEXT,
  business_notes        TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS business_settings_agent_id_idx ON business_settings(agent_id);

-- ============================================================
-- 3. ONBOARDING PROGRESS
--    Tracks which steps of the 7-step wizard are complete.
-- ============================================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step     INTEGER NOT NULL DEFAULT 1,
  completed_steps  JSONB NOT NULL DEFAULT '[]',   -- array of completed step numbers
  is_complete      BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS onboarding_progress_agent_id_idx ON onboarding_progress(agent_id);

-- ============================================================
-- 4. VOICE SETTINGS
--    AI voice assistant configuration per agent.
-- ============================================================
CREATE TABLE IF NOT EXISTS voice_settings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_voice       TEXT DEFAULT 'nova',
  greeting             TEXT,
  personality          TEXT,
  allowed_actions      TEXT,           -- comma-separated list
  escalation_behavior  TEXT,
  is_active            BOOLEAN NOT NULL DEFAULT FALSE,
  vapi_assistant_id    TEXT,           -- Vapi assistant UUID once created
  linked_phone         TEXT,           -- E.164 formatted phone number
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS voice_settings_agent_id_idx ON voice_settings(agent_id);

-- ============================================================
-- 5. LEADS
--    Prospects collected from calls, web, or manual entry.
-- ============================================================
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'unqualified', 'converted');
CREATE TYPE lead_intent AS ENUM ('buy', 'sell', 'invest', 'rent', 'other');

CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  source      TEXT,                               -- e.g. "phone_call", "website", "referral"
  status      lead_status NOT NULL DEFAULT 'new',
  intent      lead_intent,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_agent_id_idx     ON leads(agent_id);
CREATE INDEX IF NOT EXISTS leads_status_idx        ON leads(agent_id, status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx    ON leads(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_name_search_idx   ON leads USING GIN (to_tsvector('english', name));

-- ============================================================
-- 6. CALLS
--    Log of every inbound call handled by the AI assistant.
-- ============================================================
CREATE TYPE call_outcome AS ENUM ('answered', 'missed', 'voicemail', 'transferred');

CREATE TABLE IF NOT EXISTS calls (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caller_name       TEXT,
  caller_phone      TEXT,
  duration          INTEGER,                      -- seconds
  outcome           call_outcome,
  summary           TEXT,                         -- AI-generated summary
  transcript        TEXT,                         -- full conversation transcript
  extracted_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  called_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calls_agent_id_idx   ON calls(agent_id);
CREATE INDEX IF NOT EXISTS calls_called_at_idx  ON calls(agent_id, called_at DESC);
CREATE INDEX IF NOT EXISTS calls_outcome_idx    ON calls(agent_id, outcome);

-- ============================================================
-- 7. APPOINTMENTS
--    Scheduled meetings, showings, and consultations.
-- ============================================================
CREATE TYPE appointment_status AS ENUM ('upcoming', 'completed', 'cancelled', 'no_show');

CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id          UUID REFERENCES leads(id) ON DELETE SET NULL,
  lead_name        TEXT,                           -- denormalized for speed
  type             TEXT,                           -- e.g. "Buyer Consultation", "Showing"
  scheduled_at     TIMESTAMPTZ NOT NULL,
  status           appointment_status NOT NULL DEFAULT 'upcoming',
  source           TEXT,                           -- e.g. "phone_call", "manual"
  notes            TEXT,
  calendar_synced  BOOLEAN NOT NULL DEFAULT FALSE,
  google_event_id  TEXT,                           -- Google Calendar event ID once synced
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_agent_id_idx      ON appointments(agent_id);
CREATE INDEX IF NOT EXISTS appointments_scheduled_at_idx  ON appointments(agent_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS appointments_status_idx        ON appointments(agent_id, status);

-- ============================================================
-- 8. LISTINGS
--    Property listings (manual entry + future IDX/MLS feed).
-- ============================================================
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold', 'off_market');
CREATE TYPE listing_source AS ENUM ('manual', 'idx', 'mls', 'csv');

CREATE TABLE IF NOT EXISTS listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address     TEXT NOT NULL,
  price       NUMERIC(12, 2),
  beds        INTEGER,
  baths       NUMERIC(4, 1),
  sqft        INTEGER,
  status      listing_status NOT NULL DEFAULT 'active',
  notes       TEXT,
  source      listing_source NOT NULL DEFAULT 'manual',
  external_id TEXT,                               -- IDX/MLS listing ID for dedup
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS listings_agent_id_idx  ON listings(agent_id);
CREATE INDEX IF NOT EXISTS listings_status_idx    ON listings(agent_id, status);

-- ============================================================
-- 9. FAQS
--    Agent-specific FAQ entries fed to the AI assistant.
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS faqs_agent_id_idx ON faqs(agent_id);

-- ============================================================
-- 10. TOOL LOGS
--     Records of every action taken by the AI assistant
--     (calendar bookings, lead creation, transfers, etc.)
-- ============================================================
CREATE TYPE tool_log_action AS ENUM (
  'lead_created', 'appointment_booked', 'call_transferred',
  'voicemail_left', 'faq_answered', 'listing_queried', 'calendar_checked'
);

CREATE TABLE IF NOT EXISTS tool_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  call_id     UUID REFERENCES calls(id) ON DELETE SET NULL,
  action      tool_log_action NOT NULL,
  payload     JSONB,                              -- action-specific data
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tool_logs_agent_id_idx  ON tool_logs(agent_id);
CREATE INDEX IF NOT EXISTS tool_logs_call_id_idx   ON tool_logs(call_id);
CREATE INDEX IF NOT EXISTS tool_logs_created_at_idx ON tool_logs(agent_id, created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates `updated_at` on row changes.
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_agent_profiles_updated_at
  BEFORE UPDATE ON agent_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_voice_settings_updated_at
  BEFORE UPDATE ON voice_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- Every table is locked behind RLS. Agents can only access
-- their own rows. Service role (backend) bypasses RLS.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE agent_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls               ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_logs           ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- agent_profiles policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own profile"
  ON agent_profiles FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own profile"
  ON agent_profiles FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own profile"
  ON agent_profiles FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- -------------------------------------------------------
-- business_settings policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own business settings"
  ON business_settings FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own business settings"
  ON business_settings FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own business settings"
  ON business_settings FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- -------------------------------------------------------
-- onboarding_progress policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own onboarding"
  ON onboarding_progress FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own onboarding"
  ON onboarding_progress FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own onboarding"
  ON onboarding_progress FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- -------------------------------------------------------
-- voice_settings policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own voice settings"
  ON voice_settings FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own voice settings"
  ON voice_settings FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own voice settings"
  ON voice_settings FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- -------------------------------------------------------
-- leads policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own leads"
  ON leads FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own leads"
  ON leads FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own leads"
  ON leads FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: delete own leads"
  ON leads FOR DELETE
  USING (agent_id = auth.uid());

-- -------------------------------------------------------
-- calls policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own calls"
  ON calls FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own calls"
  ON calls FOR INSERT
  WITH CHECK (agent_id = auth.uid());

-- -------------------------------------------------------
-- appointments policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own appointments"
  ON appointments FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own appointments"
  ON appointments FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: delete own appointments"
  ON appointments FOR DELETE
  USING (agent_id = auth.uid());

-- -------------------------------------------------------
-- listings policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own listings"
  ON listings FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own listings"
  ON listings FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own listings"
  ON listings FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: delete own listings"
  ON listings FOR DELETE
  USING (agent_id = auth.uid());

-- -------------------------------------------------------
-- faqs policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own faqs"
  ON faqs FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "agents: insert own faqs"
  ON faqs FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: update own faqs"
  ON faqs FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "agents: delete own faqs"
  ON faqs FOR DELETE
  USING (agent_id = auth.uid());

-- -------------------------------------------------------
-- tool_logs policies
-- -------------------------------------------------------
CREATE POLICY "agents: select own tool logs"
  ON tool_logs FOR SELECT
  USING (agent_id = auth.uid());

-- ============================================================
-- SERVICE ROLE BYPASS POLICIES
-- The backend (service role) needs unrestricted access to
-- insert data from Vapi/Twilio webhooks on behalf of agents.
-- ============================================================

CREATE POLICY "service role: full access to calls"
  ON calls FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service role: full access to tool_logs"
  ON tool_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service role: full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Create a default profile + settings row when a new user signs up.
-- Wire this to auth.users via a Supabase Database Webhook or trigger.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO agent_profiles (agent_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Agent'), NEW.email);

  INSERT INTO onboarding_progress (agent_id)
  VALUES (NEW.id);

  INSERT INTO business_settings (agent_id)
  VALUES (NEW.id);

  INSERT INTO voice_settings (agent_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to auth.users (run this in Supabase SQL editor with superuser access)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
