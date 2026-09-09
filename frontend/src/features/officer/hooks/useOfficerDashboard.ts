import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { QueueEntry } from '@shared/types';

export interface CenterAnalytics {
  center_id: string;
  expected_today: number;
  arrived_today: number;
  fully_processed: number;
  currently_waiting: number;
  daily_quota_quintals: number;
  procured_today_quintals: number;
  capacity_percent: number;
}

export function useOfficerDashboard(centerId: string = 'ctr-02') {
  const [analytics, setAnalytics] = useState<CenterAnalytics | null>(null);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [analyticsRes, queueRes] = await Promise.all([
        fetchApi<CenterAnalytics>(API_ENDPOINTS.ANALYTICS.CENTER(centerId)),
        fetchApi<QueueEntry[]>(API_ENDPOINTS.QUEUE.BY_CENTER(centerId))
      ]);
      setAnalytics(analyticsRes);
      setQueue(queueRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5 sec poll
    return () => clearInterval(interval);
  }, [centerId]);

  return { analytics, queue, loading };
}
