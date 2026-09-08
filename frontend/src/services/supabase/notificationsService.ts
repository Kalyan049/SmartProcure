/**
 * SmartProcure - Notifications Service
 * Fetches and manages user notifications from Supabase.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import type { Notification } from '@shared/types';

function mapRow(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    type: row.type as Notification['type'],
    title: row.title as string,
    message: row.message as string,
    is_read: row.is_read as boolean,
    action_target: row.action_target as string | undefined,
    created_at: row.created_at as string,
  };
}

export const notificationsService = {
  /** List all notifications for a user */
  async listNotifications(userId: string): Promise<Notification[]> {
    if (!isSupabaseConfigured) return MOCK_NOTIFICATIONS;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[notificationsService] listNotifications error:', error.message);
      return MOCK_NOTIFICATIONS;
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Get unread count for badge display */
  async getUnreadCount(userId: string): Promise<number> {
    if (!isSupabaseConfigured) {
      return MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length;
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('[notificationsService] getUnreadCount error:', error.message);
      return 0;
    }
    return count ?? 0;
  },

  /** Mark a notification as read */
  async markRead(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('[notificationsService] markRead error:', error.message);
      return false;
    }
    return true;
  },

  /** Mark all notifications as read */
  async markAllRead(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('[notificationsService] markAllRead error:', error.message);
      return false;
    }
    return true;
  },

  /** Subscribe to new notifications in real-time */
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
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
