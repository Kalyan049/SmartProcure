import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { PaymentRecord } from '../../../../../backend/src/modules/payments/payments.service';

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
