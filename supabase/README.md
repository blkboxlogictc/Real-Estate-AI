# REAA — Supabase Setup Guide

## Files in this directory

| File | Purpose |
|---|---|
| `migrations/001_initial_schema.sql` | Full schema: tables, indexes, enums, RLS policies, triggers |
| `seed.sql` | Sample seed data for one demo agent |
| `types.ts` | TypeScript types for the Supabase client |

---

## Setup Steps

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Wait for it to provision.

### 2. Run the migration

In your Supabase project, open **SQL Editor** and run:

```sql
-- Copy and paste the entire contents of:
supabase/migrations/001_initial_schema.sql
```

This creates all tables, enums, indexes, RLS policies, and the `handle_new_user()` trigger.

### 3. Set environment variables

In your backend (`artifacts/api-server`), add these to your environment:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # from Project Settings → API
```

> **Important**: The service role key bypasses RLS. Only use it on the server. Never expose it to the browser.

For the frontend:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key  # from Project Settings → API
```

### 4. Install the Supabase client

```bash
# Frontend (artifacts/reaa)
pnpm --filter @workspace/reaa add @supabase/supabase-js

# Backend (artifacts/api-server)
pnpm --filter @workspace/api-server add @supabase/supabase-js
```

### 5. Use the TypeScript types

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Fully typed — autocomplete works!
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
```

### 6. Seed demo data (optional)

1. Sign up a test user via Supabase Auth
2. Copy their UUID from **Authentication → Users**
3. Open `supabase/seed.sql` and replace `a0000000-0000-0000-0000-000000000001` with that UUID
4. Run `seed.sql` in the SQL Editor

---

## Row-Level Security (RLS) Architecture

All tables have RLS enabled. Agents can only access their own rows.

| Actor | Access |
|---|---|
| `anon` | Blocked from all tables |
| Authenticated user (`auth.uid()`) | Own rows only (via `agent_id = auth.uid()`) |
| Service role (backend) | Full access to all rows (bypasses RLS) |

### How multi-tenancy works

Every data table has an `agent_id UUID` column that references `auth.users(id)`. RLS policies enforce:

```sql
-- SELECT policy example
USING (agent_id = auth.uid())
```

This means even if a malicious client sends a different `agent_id`, the database rejects it.

### New user auto-provisioning

The `handle_new_user()` trigger fires after every `INSERT` into `auth.users`. It automatically creates:
- `agent_profiles` row
- `onboarding_progress` row
- `business_settings` row  
- `voice_settings` row

This ensures every new signup has a valid profile to work with immediately.

---

## Transitioning from Drizzle ORM (current dev DB)

The app currently uses **Drizzle ORM + Replit's built-in PostgreSQL** for development. When you're ready to switch to Supabase:

1. Run the migration SQL above
2. Install `@supabase/supabase-js`
3. Replace the `db` import in `artifacts/api-server/src/routes/` with a Supabase service client
4. Replace `agent_id = 1` (integer) with `agent_id = auth.uid()` (UUID) throughout
5. Wire Supabase Auth in the frontend (replacing the demo localStorage auth)

The schema is intentionally compatible with Drizzle's structure — column names and types are identical.
