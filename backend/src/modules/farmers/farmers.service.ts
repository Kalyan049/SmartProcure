/**
 * SmartProcure Farmers Service — Module 6: Farmer Profile
 *
 * Handles fetching and updating farmer profiles, as well as providing mock
 * history data for bookings, procurement, and payments.
 */

import { supabase, isDatabaseConfigured } from '../../config/supabase';
import { logger } from '../../utils/logger';

export interface FarmerProfileData {
  id?: string;
  user_id: string;
  farmer_id_code: string;
  is_aadhaar_verified: boolean;
  aadhaar_masked: string;
  land_size_acres: number;
  land_village: string;
  land_district: string;
  land_state: string;
  bank_account_number_masked: string;
  bank_ifsc: string;
  bank_name: string;
  crops_grown: string[];
  expected_quantity?: number; // In-memory mock for MVP
  harvest_date?: string; // In-memory mock for MVP
  created_at?: string;
}

// In-memory store for fields not in the current DB schema (for MVP)
const MOCK_EXTENDED_PROFILE: Record<string, { expected_quantity: number; harvest_date: string }> = {
  'usr-farmer-demo-01': { expected_quantity: 50, harvest_date: '2026-10-15' },
};

// Mock history data for MVP
const MOCK_BOOKING_HISTORY = [
  { id: 'bk-prev-01', date: '2025-11-10', center: 'Kashi Mandi Center A', quantity: 40, status: 'COMPLETED' },
  { id: 'bk-prev-02', date: '2026-04-12', center: 'Sewapuri Farmer Hub C', quantity: 45, status: 'COMPLETED' }
];

const MOCK_PROCUREMENT_HISTORY = [
  { id: 'pr-prev-01', date: '2025-11-10', crop: 'Paddy', accepted_quantity: 38, grade: 'A', status: 'COMPLETED' },
  { id: 'pr-prev-02', date: '2026-04-12', crop: 'Wheat', accepted_quantity: 44, grade: 'B', status: 'COMPLETED' }
];

const MOCK_PAYMENT_HISTORY = [
  { id: 'py-prev-01', date: '2025-11-12', amount: 83600, status: 'CREDITED', ref: 'TXN892347291' },
  { id: 'py-prev-02', date: '2026-04-15', amount: 94600, status: 'CREDITED', ref: 'TXN234981238' }
];

export async function getFarmerProfile(userId: string): Promise<FarmerProfileData | null> {
  // Try Supabase first
  if (isDatabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      const ext = MOCK_EXTENDED_PROFILE[userId] || { expected_quantity: 0, harvest_date: '' };
      return {
        ...data,
        aadhaar_masked: 'XXXXXXXX3421', // Mocked as PII is not stored plainly
        expected_quantity: ext.expected_quantity,
        harvest_date: ext.harvest_date,
      } as FarmerProfileData;
    }
  }

  // Fallback to mock profile if DB is not configured or user not found
  return {
    id: 'prof-mock-01',
    user_id: userId,
    farmer_id_code: 'SP-FARMER-1082',
    is_aadhaar_verified: true,
    aadhaar_masked: 'XXXXXXXX3421',
    land_size_acres: 4.5,
    land_village: 'Rampur',
    land_district: 'Varanasi',
    land_state: 'Uttar Pradesh',
    bank_account_number_masked: 'XXXXXX5892',
    bank_ifsc: 'SBIN0001234',
    bank_name: 'State Bank of India',
    crops_grown: ['Paddy', 'Wheat'],
    expected_quantity: MOCK_EXTENDED_PROFILE[userId]?.expected_quantity || 50,
    harvest_date: MOCK_EXTENDED_PROFILE[userId]?.harvest_date || '2026-10-15',
    created_at: new Date().toISOString(),
  };
}

export async function updateFarmerProfile(userId: string, updates: Partial<FarmerProfileData>): Promise<FarmerProfileData | null> {
  // Save extended fields to memory
  if (updates.expected_quantity !== undefined || updates.harvest_date !== undefined) {
    MOCK_EXTENDED_PROFILE[userId] = {
      expected_quantity: updates.expected_quantity || MOCK_EXTENDED_PROFILE[userId]?.expected_quantity || 0,
      harvest_date: updates.harvest_date || MOCK_EXTENDED_PROFILE[userId]?.harvest_date || '',
    };
  }

  // Supabase update
  if (isDatabaseConfigured() && supabase) {
    const dbUpdates: any = {};
    if (updates.land_size_acres !== undefined) dbUpdates.land_size_acres = updates.land_size_acres;
    if (updates.land_village !== undefined) dbUpdates.land_village = updates.land_village;
    if (updates.land_district !== undefined) dbUpdates.land_district = updates.land_district;
    if (updates.land_state !== undefined) dbUpdates.land_state = updates.land_state;
    if (updates.crops_grown !== undefined) dbUpdates.crops_grown = updates.crops_grown;

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase
        .from('farmer_profiles')
        .update(dbUpdates)
        .eq('user_id', userId);

      if (error) {
        logger.error('[Farmers Service] Failed to update profile in DB', error);
      }
    }
  }

  return getFarmerProfile(userId);
}

// Mock History Methods
export async function getBookingHistory(userId: string) {
  return MOCK_BOOKING_HISTORY;
}

export async function getProcurementHistory(userId: string) {
  return MOCK_PROCUREMENT_HISTORY;
}

export async function getPaymentHistory(userId: string) {
  return MOCK_PAYMENT_HISTORY;
}
