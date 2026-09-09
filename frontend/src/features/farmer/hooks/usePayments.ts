import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';

export interface PaymentRecord {
  id: string;
  procurement_id: string;
  farmer_id: string;
  transaction_ref?: string;
  crop: string;
  grade: string;
  quantity_quintals: number;
  msp_rate_per_quintal: number;
  gross_amount: number;
  net_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'CREDITED' | 'FAILED';
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetchApi<PaymentRecord[]>(API_ENDPOINTS.PAYMENTS.MY);
      setPayments(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();

    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  return { payments, loading };
}
