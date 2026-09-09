import { useState, useEffect, useRef } from 'react';
import { QueueEntry } from '@shared/types';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type ConnectionStatus = 'CONNECTING' | 'LIVE' | 'ERROR' | 'OFFLINE';

export function useQueueRealtime(tokenNumber?: string) {
  const [queueEntry, setQueueEntry] = useState<QueueEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('CONNECTING');

  const pollIntervalRef = useRef<number | null>(null);

  const fetchQueue = async () => {
    try {
      const url = tokenNumber 
        ? `${API_ENDPOINTS.QUEUE.MY}?token=${tokenNumber}` 
        : API_ENDPOINTS.QUEUE.MY;
      const res = await fetchApi<QueueEntry>(url);
      setQueueEntry(res);
      setError(null);
      if (status !== 'LIVE') setStatus('LIVE');
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Queue completed or not found
        setQueueEntry(null);
        setStatus('OFFLINE');
      } else {
        setError(err.message || 'Failed to sync queue');
        setStatus('ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    if (isSupabaseConfigured) {
      // ── SUPABASE REALTIME MODE ──
      const channel = supabase
        .channel('public:queue_entries')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'queue_entries',
            filter: tokenNumber ? `token_number=eq.${tokenNumber}` : undefined,
          },
          (payload) => {
            setQueueEntry(payload.new as QueueEntry);
          }
        )
        .subscribe((eventStatus) => {
          if (eventStatus === 'SUBSCRIBED') setStatus('LIVE');
          if (eventStatus === 'CLOSED') setStatus('OFFLINE');
          if (eventStatus === 'CHANNEL_ERROR') setStatus('ERROR');
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // ── MOCK HTTP POLLING MODE (Fallback for MVP Demo) ──
      pollIntervalRef.current = window.setInterval(() => {
        // Only poll if we are not already completed
        setQueueEntry((current) => {
          if (current?.status === 'COMPLETED') {
            if (pollIntervalRef.current) window.clearInterval(pollIntervalRef.current);
            return current;
          }
          return current;
        });
        
        fetchQueue();
      }, 5000); // 5 second polling

      return () => {
        if (pollIntervalRef.current) window.clearInterval(pollIntervalRef.current);
      };
    }
  }, [tokenNumber]);

  return { queueEntry, loading, error, status };
}
