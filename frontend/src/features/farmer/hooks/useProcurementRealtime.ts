import { useState, useEffect, useRef } from 'react';
import { Procurement, ProcurementEvent } from '@shared/types';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';

interface ProcurementData {
  procurement: Procurement;
  events: ProcurementEvent[];
}

export function useProcurementRealtime(mode: 'my' | 'officer', procurementId?: string) {
  const [data, setData] = useState<ProcurementData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<number | null>(null);

  const fetchData = async () => {
    try {
      const url = mode === 'my' 
        ? API_ENDPOINTS.PROCUREMENT.MY 
        : API_ENDPOINTS.PROCUREMENT.DETAIL(procurementId!);
        
      const res = await fetchApi<ProcurementData>(url);
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch procurement data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    pollIntervalRef.current = window.setInterval(() => {
      setData((current) => {
        if (current?.procurement.status === 'PAYMENT' || current?.procurement.status === 'COMPLETED') {
          if (pollIntervalRef.current) window.clearInterval(pollIntervalRef.current);
          return current;
        }
        return current;
      });
      fetchData();
    }, 5000); // 5 sec poll

    return () => {
      if (pollIntervalRef.current) window.clearInterval(pollIntervalRef.current);
    };
  }, [mode, procurementId]);

  const advanceStage = async (payload: any) => {
    if (!data) return;
    try {
      await fetchApi(API_ENDPOINTS.PROCUREMENT.ADVANCE(data.procurement.id), {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      await fetchData(); // Refresh immediately
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { data, loading, error, advanceStage };
}
