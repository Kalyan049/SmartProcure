import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetchApi<AppNotification[]>(API_ENDPOINTS.NOTIFICATIONS.MY);
      setNotifications(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    await fetchApi(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), { method: 'POST' });
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return { notifications, loading, markAsRead };
}
