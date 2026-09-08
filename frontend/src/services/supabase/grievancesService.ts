/**
 * SmartProcure - Grievances Service
 * Manages farmer grievances via Supabase.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Grievance } from '@shared/types';

const MOCK_GRIEVANCE: Grievance = {
  id: 'grv-01',
  farmer_id: 'usr-farmer-01',
  booking_id: 'bk-1047',
  category: 'QUEUE_DELAY',
  title: 'Long wait at weighbridge',
  description: 'Had to wait 45 extra minutes at the weighbridge.',
  status: 'UNDER_REVIEW',
  created_at: '2026-09-08T11:00:00Z',
  updated_at: '2026-09-08T12:00:00Z',
};

function mapRow(row: Record<string, unknown>): Grievance {
  return {
    id: row.id as string,
    farmer_id: row.farmer_id as string,
    booking_id: row.booking_id as string | undefined,
    category: row.category as Grievance['category'],
    title: row.title as string,
    description: row.description as string,
    document_url: row.document_url as string | undefined,
    status: row.status as Grievance['status'],
    resolution_notes: row.resolution_notes as string | undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export const grievancesService = {
  /** List all grievances for a farmer */
  async listFarmerGrievances(farmerId: string): Promise<Grievance[]> {
    if (!isSupabaseConfigured) return [MOCK_GRIEVANCE];

    const { data, error } = await supabase
      .from('grievances')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[grievancesService] listFarmerGrievances error:', error.message);
      return [MOCK_GRIEVANCE];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** List all grievances for officer management */
  async listAllGrievances(status?: Grievance['status']): Promise<Grievance[]> {
    if (!isSupabaseConfigured) return [MOCK_GRIEVANCE];

    let query = supabase
      .from('grievances')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[grievancesService] listAllGrievances error:', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Submit a new grievance */
  async submitGrievance(
    grievance: Omit<Pick<Grievance, 'farmer_id' | 'booking_id' | 'category' | 'title' | 'description' | 'document_url'>, 'category'> & { category: 'DELAY' | 'QUALITY_DISPUTE' | 'PAYMENT' | 'FACILITY' | 'OTHER' }
  ): Promise<Grievance | null> {
    if (!isSupabaseConfigured) return { ...MOCK_GRIEVANCE, ...grievance } as unknown as Grievance;

    const { data, error } = await supabase
      .from('grievances')
      .insert({ ...grievance, status: 'SUBMITTED' })
      .select()
      .single();

    if (error) {
      console.error('[grievancesService] submitGrievance error:', error.message);
      return null;
    }
    return mapRow(data as Record<string, unknown>);
  },

  /** Update grievance status (officer only) */
  async updateGrievanceStatus(
    grievanceId: string,
    status: Grievance['status'],
    resolution_notes?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const { error } = await supabase
      .from('grievances')
      .update({ status, resolution_notes })
      .eq('id', grievanceId);

    if (error) {
      console.error('[grievancesService] updateGrievanceStatus error:', error.message);
      return false;
    }
    return true;
  },
};

