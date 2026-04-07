/**
 * Real Estate AI Assistant (REAA) — Supabase Database TypeScript Types
 *
 * Generated from supabase/migrations/001_initial_schema.sql
 *
 * USAGE:
 *   import { createClient } from '@supabase/supabase-js'
 *   import type { Database } from './supabase/types'
 *
 *   const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
 *
 *   const { data } = await supabase
 *     .from('leads')
 *     .select('*')
 *     .eq('agent_id', userId)
 *
 *   // data is typed as Database['public']['Tables']['leads']['Row'][]
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ────────────────────────────────────────────────────────────
// ENUM TYPES
// ────────────────────────────────────────────────────────────

export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified" | "converted";
export type LeadIntent = "buy" | "sell" | "invest" | "rent" | "other";
export type CallOutcome = "answered" | "missed" | "voicemail" | "transferred";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "no_show";
export type ListingStatus = "active" | "pending" | "sold" | "off_market";
export type ListingSource = "manual" | "idx" | "mls" | "csv";
export type ToolLogAction =
  | "lead_created"
  | "appointment_booked"
  | "call_transferred"
  | "voicemail_left"
  | "faq_answered"
  | "listing_queried"
  | "calendar_checked";

// ────────────────────────────────────────────────────────────
// DATABASE INTERFACE (matches Supabase client generic)
// ────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      // --------------------------------------------------
      // agent_profiles
      // --------------------------------------------------
      agent_profiles: {
        Row: {
          id: string;                  // UUID
          agent_id: string;            // UUID → auth.users(id)
          full_name: string;
          brokerage: string | null;
          email: string;
          phone: string | null;
          bio: string | null;
          service_areas: string | null;
          escalation_contact: string | null;
          created_at: string;          // ISO 8601 timestamptz
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          full_name: string;
          brokerage?: string | null;
          email: string;
          phone?: string | null;
          bio?: string | null;
          service_areas?: string | null;
          escalation_contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          brokerage?: string | null;
          email?: string;
          phone?: string | null;
          bio?: string | null;
          service_areas?: string | null;
          escalation_contact?: string | null;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // business_settings
      // --------------------------------------------------
      business_settings: {
        Row: {
          id: string;
          agent_id: string;
          appointment_types: string | null;
          appointment_duration: number | null;   // minutes
          booking_buffer: number | null;         // minutes
          office_hours: string | null;
          lead_routing_prefs: string | null;
          handoff_rules: string | null;
          transfer_instructions: string | null;
          business_notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          appointment_types?: string | null;
          appointment_duration?: number | null;
          booking_buffer?: number | null;
          office_hours?: string | null;
          lead_routing_prefs?: string | null;
          handoff_rules?: string | null;
          transfer_instructions?: string | null;
          business_notes?: string | null;
          updated_at?: string;
        };
        Update: {
          appointment_types?: string | null;
          appointment_duration?: number | null;
          booking_buffer?: number | null;
          office_hours?: string | null;
          lead_routing_prefs?: string | null;
          handoff_rules?: string | null;
          transfer_instructions?: string | null;
          business_notes?: string | null;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // onboarding_progress
      // --------------------------------------------------
      onboarding_progress: {
        Row: {
          id: string;
          agent_id: string;
          current_step: number;
          completed_steps: number[];    // JSONB array
          is_complete: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          current_step?: number;
          completed_steps?: number[];
          is_complete?: boolean;
          updated_at?: string;
        };
        Update: {
          current_step?: number;
          completed_steps?: number[];
          is_complete?: boolean;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // voice_settings
      // --------------------------------------------------
      voice_settings: {
        Row: {
          id: string;
          agent_id: string;
          selected_voice: string | null;
          greeting: string | null;
          personality: string | null;
          allowed_actions: string | null;
          escalation_behavior: string | null;
          is_active: boolean;
          vapi_assistant_id: string | null;
          linked_phone: string | null;          // E.164 e.g. "+14155550100"
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          selected_voice?: string | null;
          greeting?: string | null;
          personality?: string | null;
          allowed_actions?: string | null;
          escalation_behavior?: string | null;
          is_active?: boolean;
          vapi_assistant_id?: string | null;
          linked_phone?: string | null;
          updated_at?: string;
        };
        Update: {
          selected_voice?: string | null;
          greeting?: string | null;
          personality?: string | null;
          allowed_actions?: string | null;
          escalation_behavior?: string | null;
          is_active?: boolean;
          vapi_assistant_id?: string | null;
          linked_phone?: string | null;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // leads
      // --------------------------------------------------
      leads: {
        Row: {
          id: string;
          agent_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          source: string | null;
          status: LeadStatus;
          intent: LeadIntent | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          source?: string | null;
          status?: LeadStatus;
          intent?: LeadIntent | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          email?: string | null;
          source?: string | null;
          status?: LeadStatus;
          intent?: LeadIntent | null;
          notes?: string | null;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // calls
      // --------------------------------------------------
      calls: {
        Row: {
          id: string;
          agent_id: string;
          caller_name: string | null;
          caller_phone: string | null;
          duration: number | null;               // seconds
          outcome: CallOutcome | null;
          summary: string | null;
          transcript: string | null;
          extracted_lead_id: string | null;
          called_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          caller_name?: string | null;
          caller_phone?: string | null;
          duration?: number | null;
          outcome?: CallOutcome | null;
          summary?: string | null;
          transcript?: string | null;
          extracted_lead_id?: string | null;
          called_at?: string;
          created_at?: string;
        };
        Update: {
          summary?: string | null;
          transcript?: string | null;
          outcome?: CallOutcome | null;
          extracted_lead_id?: string | null;
        };
      };

      // --------------------------------------------------
      // appointments
      // --------------------------------------------------
      appointments: {
        Row: {
          id: string;
          agent_id: string;
          lead_id: string | null;
          lead_name: string | null;
          type: string | null;
          scheduled_at: string;
          status: AppointmentStatus;
          source: string | null;
          notes: string | null;
          calendar_synced: boolean;
          google_event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          lead_id?: string | null;
          lead_name?: string | null;
          type?: string | null;
          scheduled_at: string;
          status?: AppointmentStatus;
          source?: string | null;
          notes?: string | null;
          calendar_synced?: boolean;
          google_event_id?: string | null;
          created_at?: string;
        };
        Update: {
          lead_name?: string | null;
          type?: string | null;
          scheduled_at?: string;
          status?: AppointmentStatus;
          source?: string | null;
          notes?: string | null;
          calendar_synced?: boolean;
          google_event_id?: string | null;
        };
      };

      // --------------------------------------------------
      // listings
      // --------------------------------------------------
      listings: {
        Row: {
          id: string;
          agent_id: string;
          address: string;
          price: number | null;
          beds: number | null;
          baths: number | null;
          sqft: number | null;
          status: ListingStatus;
          notes: string | null;
          source: ListingSource;
          external_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          address: string;
          price?: number | null;
          beds?: number | null;
          baths?: number | null;
          sqft?: number | null;
          status?: ListingStatus;
          notes?: string | null;
          source?: ListingSource;
          external_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          address?: string;
          price?: number | null;
          beds?: number | null;
          baths?: number | null;
          sqft?: number | null;
          status?: ListingStatus;
          notes?: string | null;
          source?: ListingSource;
          external_id?: string | null;
          updated_at?: string;
        };
      };

      // --------------------------------------------------
      // faqs
      // --------------------------------------------------
      faqs: {
        Row: {
          id: string;
          agent_id: string;
          question: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          question: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          question?: string;
          answer?: string;
        };
      };

      // --------------------------------------------------
      // tool_logs
      // --------------------------------------------------
      tool_logs: {
        Row: {
          id: string;
          agent_id: string;
          call_id: string | null;
          action: ToolLogAction;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          call_id?: string | null;
          action: ToolLogAction;
          payload?: Json | null;
          created_at?: string;
        };
        Update: {
          payload?: Json | null;
        };
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      lead_status: LeadStatus;
      lead_intent: LeadIntent;
      call_outcome: CallOutcome;
      appointment_status: AppointmentStatus;
      listing_status: ListingStatus;
      listing_source: ListingSource;
      tool_log_action: ToolLogAction;
    };
  };
}

// ────────────────────────────────────────────────────────────
// CONVENIENCE TYPE ALIASES
// These let you write `AgentProfile` instead of the full path.
// ────────────────────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Row types
export type AgentProfileRow       = Tables<"agent_profiles">;
export type BusinessSettingsRow   = Tables<"business_settings">;
export type OnboardingProgressRow = Tables<"onboarding_progress">;
export type VoiceSettingsRow      = Tables<"voice_settings">;
export type LeadRow               = Tables<"leads">;
export type CallRow               = Tables<"calls">;
export type AppointmentRow        = Tables<"appointments">;
export type ListingRow            = Tables<"listings">;
export type FaqRow                = Tables<"faqs">;
export type ToolLogRow            = Tables<"tool_logs">;

// Insert DTOs
export type InsertAgentProfile       = InsertDto<"agent_profiles">;
export type InsertBusinessSettings   = InsertDto<"business_settings">;
export type InsertOnboardingProgress = InsertDto<"onboarding_progress">;
export type InsertVoiceSettings      = InsertDto<"voice_settings">;
export type InsertLead               = InsertDto<"leads">;
export type InsertCall               = InsertDto<"calls">;
export type InsertAppointment        = InsertDto<"appointments">;
export type InsertListing            = InsertDto<"listings">;
export type InsertFaq                = InsertDto<"faqs">;
export type InsertToolLog            = InsertDto<"tool_logs">;
