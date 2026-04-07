# Real Estate AI Assistant (REAA) — Workspace

## Overview

Full-stack production SaaS for real estate agents to manage an AI voice assistant that answers calls, collects leads, schedules appointments, and manages their entire business. Multi-tenant architecture with a demo agent seeded.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui (artifacts/reaa)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec)
- **Routing**: Wouter (frontend)
- **Forms**: react-hook-form + zod
- **State/data**: TanStack React Query (via generated hooks)
- **Animations**: Framer Motion
- **Build**: esbuild (CJS bundle for backend)

## Architecture

- **Frontend artifact**: `artifacts/reaa/` — React + Vite app at preview path `/`
- **Backend artifact**: `artifacts/api-server/` — Express server at path `/api`
- **Shared DB library**: `lib/db/` — Drizzle ORM schema and connection
- **Shared API client**: `lib/api-client-react/` — generated React Query hooks
- **API spec**: `lib/api-spec/openapi.yaml` — source of truth for all API contracts

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/reaa run dev` — run frontend locally

## Database Schema

Tables (all scoped to agent_id for multi-tenancy):
- `agent_profiles` — agent profile info (name, brokerage, email, phone, etc.)
- `business_settings` — onboarding business data (appointment types, hours, rules)
- `onboarding_progress` — per-agent onboarding step progress
- `voice_settings` — AI voice assistant configuration per agent
- `leads` — lead records (name, phone, email, source, status, intent)
- `calls` — call logs (caller info, duration, outcome, summary, transcript)
- `appointments` — scheduled appointments
- `listings` — property listings (address, price, beds/baths, sqft, status)
- `faqs` — FAQ entries for the AI assistant

Demo data is seeded for agent_id=1 (Alex Johnson, Premier Realty Group).

## Frontend Pages

- `/` — Public landing page (no auth required)
- `/login` — Login (demo mode: any credentials work)
- `/signup` — Signup
- `/dashboard` — Dashboard overview with stats and activity feed
- `/onboarding` — 7-step onboarding wizard
- `/leads` — Leads management table with detail sheet
- `/calls` — Call log with detail view
- `/appointments` — Appointments management
- `/listings` — Property listings management
- `/integrations` — Integration status cards
- `/voice-agent` — Voice assistant configuration
- `/profile` — Agent profile and business settings
- `/settings` — Account settings

## Backend API Routes

All routes prefixed with `/api`:
- `GET /dashboard/summary` — dashboard stats
- `GET /dashboard/recent-activity` — activity feed
- `GET|PUT /agents/profile` — agent profile CRUD
- `GET|PUT /agents/business-settings` — business settings CRUD
- `GET|PUT /agents/onboarding` — onboarding progress
- `GET|PUT /voice-settings` — voice agent settings
- `GET /vapi/assistant/status` — Vapi assistant status
- `GET|POST /leads`, `GET|PUT /leads/:id` — leads CRUD
- `GET /leads/stats` — lead status breakdown
- `GET /calls`, `GET /calls/:id` — call logs
- `GET|POST /appointments`, `PUT /appointments/:id` — appointments
- `GET|POST|PUT|DELETE /listings` — listings CRUD
- `GET|POST|PUT|DELETE /faqs` — FAQ entries
- `GET /integrations` — integration statuses (mock)
- `GET /twilio/numbers/search` — search Twilio numbers (mock)
- `POST /twilio/numbers/purchase` — purchase number (mock)

## Integration Stubs (Ready to Wire)

- **Twilio** — number search/purchase endpoints with mock data
- **Vapi** — assistant status endpoint
- **OpenAI** — service module placeholder for summarization
- **Google Calendar** — OAuth flow stubs
- **MLS/IDX** — connector status placeholder

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit DB)
- `SESSION_SECRET` — session secret
- `PORT` — assigned per workflow
- `BASE_PATH` — frontend base path

## Auth

Currently demo mode — any credentials work. Auth state is stored in localStorage. Ready to integrate Clerk or Replit Auth when needed.
