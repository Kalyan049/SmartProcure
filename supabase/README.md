# SmartProcure Supabase Database Setup

> Source of Truth: ARCHITECTURE.md Section 12 & 18

## Prerequisites
- A Supabase project (free tier works for development): https://supabase.com
- Access to the Supabase Dashboard > SQL Editor

---

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com and sign in.
2. Click **New Project**.
3. Choose an organization, name the project `SmartProcure`, set a strong database password, and choose a region.
4. Wait for the project to provision (~2 minutes).

---

## Step 2: Apply the Schema

1. In your Supabase dashboard, navigate to **SQL Editor**.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repository.
4. Paste the entire contents into the SQL editor.
5. Click **Run** (or press Ctrl+Enter).

This creates all 14 tables, triggers, indexes, and Row Level Security policies.

---

## Step 3: Load Demo Seed Data

1. In the SQL Editor, create another **New query**.
2. Open `supabase/seed.sql` from this repository.
3. Paste the entire contents and click **Run**.

This loads demo farmers, centers, slots, bookings, queue entries, procurements, payments, notifications, grievances, audit logs, and voice sessions.

---

## Step 4: Configure Frontend Environment

1. In Supabase Dashboard, go to **Settings > API**.
2. Copy the **Project URL** and **anon/public** key.
3. In the `frontend/` folder, create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Restart the dev server:
```bash
cd frontend
npm run dev
```

> **Without these env vars**, the app runs in offline mock-data mode, which is fine for UI development.

---

## Step 5: Enable Realtime (Optional but Recommended)

For live queue updates and procurement stage tracking:

1. In Supabase Dashboard, go to **Database > Replication**.
2. Enable replication for the following tables:
   - `queue_entries`
   - `procurements`
   - `procurement_centers`
   - `notifications`
   - `payments`

---

## Database Tables Reference

| Table                   | Purpose                                     | RLS |
|-------------------------|---------------------------------------------|-----|
| `users`                 | All users (farmers, officers, admins)       | ?  |
| `farmer_profiles`       | Extended farmer KYC & land data             | ?  |
| `procurement_centers`   | Center info, capacity, and load status      | ?  |
| `slots`                 | Time-slot bookings per center               | ?  |
| `bookings`              | Farmer slot reservations & tokens           | ?  |
| `queue_entries`         | Real-time queue position tracking           | ?  |
| `procurements`          | Core procurement lifecycle state machine    | ?  |
| `procurement_events`    | Immutable audit trail per stage             | ?  |
| `payments`              | DBT payment records                         | ?  |
| `notifications`         | Push/in-app alerts per user                 | ?  |
| `grievances`            | Farmer complaint management                 | ?  |
| `audit_logs`            | Officer action logging                      | ?  |
| `voice_sessions`        | IVR/web voice agent sessions                | ?  |
| `voice_outbound_triggers` | Outbound proactive call records           | ?  |

---

## Regenerating TypeScript Types

After any schema changes, regenerate the TypeScript types:

```bash
# Install Supabase CLI first: https://supabase.com/docs/guides/cli
npx supabase gen types typescript --project-id your-project-ref > frontend/src/lib/database.types.ts
```

---

## Offline / Mock Mode

The frontend always falls back to static mock data in `frontend/src/data/mockData.ts` when:
- `VITE_SUPABASE_URL` is not set
- `VITE_SUPABASE_ANON_KEY` is not set
- The Supabase project is unreachable

This allows the full UI to be developed and tested without a live database.

---

## Demo Credentials

| Role    | Name                       | Mobile     | Language |
|---------|----------------------------|------------|----------|
| FARMER  | Ramesh Kumar               | 9876543210 | English  |
| FARMER  | Sunita Devi                | 9876543211 | Hindi    |
| FARMER  | Harpreet Singh             | 9876543212 | English  |
| FARMER  | Baldev Prasad              | 9876543213 | Telugu   |
| OFFICER | Procurement Officer Rawat  | 9999999999 | English  |
| ADMIN   | System Administrator       | 8888888888 | English  |
