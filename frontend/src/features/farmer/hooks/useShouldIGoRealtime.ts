import { useState, useEffect, useRef } from 'react';
import { ShouldIGoNowResult } from '@shared/types';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { ConnectionStatus } from './useQueueRealtime';

export function useShouldIGoRealtime(tokenNumber?: string) {
  const [advisory, setAdvisory] = useState<ShouldIGoNowResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('CONNECTING');

  const pollIntervalRef = useRef<number | null>(null);

  const fetchAdvisory = async () => {
    try {
      const url = tokenNumber 
        ? `${API_ENDPOINTS.QUEUE.SHOULD_I_GO}?token=${tokenNumber}` 
        : API_ENDPOINTS.QUEUE.SHOULD_I_GO;
      const res = await fetchApi<ShouldIGoNowResult>(url);
      setAdvisory(res);
      setError(null);
      if (status !== 'LIVE') setStatus('LIVE');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch advisory');
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();

    // Polling every 10 seconds for the advisory.
    // In production with Supabase, we would listen to `queue_entries` changes,
    // and re-fetch the advisory (or calculate it client-side).
    // For MVP, polling the endpoint is sufficient to demonstrate the realtime updates.
    pollIntervalRef.current = window.setInterval(() => {
      fetchAdvisory();
    }, 10000);

    return () => {
      if (pollIntervalRef.current) window.clearInterval(pollIntervalRef.current);
    };
  }, [tokenNumber]);

  return { advisory, loading, error, status };
}
