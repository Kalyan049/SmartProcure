import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';

let supabase: SupabaseClient | null = null;

export const isDatabaseConfigured = (): boolean => {
  return Boolean(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY && !ENV.SUPABASE_URL.includes('your-project'));
};

if (isDatabaseConfigured()) {
  supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
  console.log('✓ Supabase client connected to:', ENV.SUPABASE_URL);
} else {
  console.log('ℹ Supabase credentials not configured in .env. Backend operating with high-fidelity in-memory seed dataset.');
}

export const checkDatabaseConnectivity = async (): Promise<{
  connected: boolean;
  mode: 'supabase' | 'in_memory_mock';
  message: string;
  timestamp: string;
}> => {
  const timestamp = new Date().toISOString();

  if (!isDatabaseConfigured() || !supabase) {
    return {
      connected: true,
      mode: 'in_memory_mock',
      message: 'Operating in standalone mock mode with seeded architecture data',
      timestamp,
    };
  }

  try {
    const { data, error } = await supabase.from('procurement_centers').select('id, code, name').limit(1);
    if (error) throw error;
    return {
      connected: true,
      mode: 'supabase',
      message: `Successfully queried procurement_centers (${data?.length || 0} records found)`,
      timestamp,
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: 'supabase',
      message: `Database connection error: ${err.message || String(err)}`,
      timestamp,
    };
  }
};

export { supabase };
