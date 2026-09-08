/**
 * SmartProcure - Payments Service
 * Fetches payment records from Supabase.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PAYMENT } from '@/data/mockData';
import type { Payment } from '@shared/types';

function mapRow(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string,
    procurement_id: row.procurement_id as string,
    farmer_id: row.farmer_id as string,
    crop: row.crop as string,
    accepted_quantity_quintals: Number(row.accepted_quantity_quintals),
    rate_per_quintal: Number(row.rate_per_quintal),
    gross_amount: Number(row.gross_amount),
    deductions_amount: Number(row.deductions_amount),
    net_amount: Number(row.net_amount),
    status: row.status as Payment['status'],
    transaction_reference: row.transaction_reference as string | undefined,
    bank_account_masked: row.bank_account_masked as string | undefined,
    credited_date: row.credited_date as string | undefined,
    created_at: row.created_at as string,
  };
}

export const paymentsService = {
  /** Get all payments for a farmer */
  async listFarmerPayments(farmerId: string): Promise<Payment[]> {
    if (!isSupabaseConfigured) return [MOCK_PAYMENT];

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[paymentsService] listFarmerPayments error:', error.message);
      return [MOCK_PAYMENT];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Get a single payment by procurement ID */
  async getPaymentByProcurement(procurementId: string): Promise<Payment | null> {
    if (!isSupabaseConfigured) return MOCK_PAYMENT;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('procurement_id', procurementId)
      .maybeSingle();

    if (error) {
      console.error('[paymentsService] getPaymentByProcurement error:', error.message);
      return MOCK_PAYMENT;
    }
    return data ? mapRow(data as Record<string, unknown>) : null;
  },

  /** Subscribe to real-time payment status changes */
  subscribeToPayment(
    paymentId: string,
    callback: (payment: Payment) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`payment-${paymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `id=eq.${paymentId}`,
        },
        (payload) => {
          callback(mapRow(payload.new as Record<string, unknown>));
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
