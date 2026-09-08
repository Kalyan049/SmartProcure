/**
 * SmartProcure Supabase Client
 * Single shared instance - import from this file everywhere.
 * Source of Truth: ARCHITECTURE.md Section 12 (Database & Supabase)
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[SmartProcure] Supabase credentials missing. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local ' +
      'to connect to the live database. Running in mock-data mode.'
  );
}

/**
 * Typed Supabase client. Use this throughout the app.
 * Falls back gracefully when credentials are absent (demo / offline mode).
 */
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/** True when real Supabase credentials are configured */
export const isSupabaseConfigured =
  !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl.includes('placeholder');
