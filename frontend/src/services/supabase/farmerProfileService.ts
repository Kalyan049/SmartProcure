/**
 * SmartProcure - Farmer Profile Service
 * Reads and updates farmer profile data from Supabase.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { FarmerProfile } from '@shared/types';

const MOCK_PROFILE: FarmerProfile = {
  id: 'fp-01',
  user_id: 'usr-farmer-01',
  farmer_id_code: 'SP-FARMER-1082',
  is_aadhaar_verified: true,
  land_size_acres: 4.5,
  land_village: 'Rampur',
  land_district: 'Varanasi',
  land_state: 'Uttar Pradesh',
  bank_account_number_masked: 'XXXX-XXXX-4812',
  bank_ifsc: 'SBIN0001234',
  bank_name: 'State Bank of India',
  crops_grown: ['Wheat', 'Paddy'],
  created_at: '2026-09-08T00:00:00Z',
};

function mapRow(row: Record<string, unknown>): FarmerProfile {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    farmer_id_code: row.farmer_id_code as string,
    is_aadhaar_verified: row.is_aadhaar_verified as boolean,
    land_size_acres: Number(row.land_size_acres),
    land_village: row.land_village as string,
    land_district: row.land_district as string,
    land_state: row.land_state as string,
    land_document_url: row.land_document_url as string | undefined,
    bank_account_number_masked: row.bank_account_number_masked as string | undefined,
    bank_ifsc: row.bank_ifsc as string,
    bank_name: row.bank_name as string,
    crops_grown: row.crops_grown as string[],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string | undefined,
  };
}

export const farmerProfileService = {
  /** Get farmer profile by user ID */
  async getProfile(userId: string): Promise<FarmerProfile | null> {
    if (!isSupabaseConfigured) return MOCK_PROFILE;

    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[farmerProfileService] getProfile error:', error.message);
      return MOCK_PROFILE;
    }
    return data ? mapRow(data as Record<string, unknown>) : null;
  },

  /** Update farmer profile */
  async updateProfile(
    profileId: string,
    updates: Partial<Pick<FarmerProfile, 'land_size_acres' | 'land_village' | 'crops_grown' | 'bank_name' | 'bank_ifsc'>>
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const { error } = await supabase
      .from('farmer_profiles')
      .update(updates)
      .eq('id', profileId);

    if (error) {
      console.error('[farmerProfileService] updateProfile error:', error.message);
      return false;
    }
    return true;
  },
};
