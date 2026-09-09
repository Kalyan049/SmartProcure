import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  created_at: string;
}

// Global mock state
export const DEMO_NOTIFICATIONS: AppNotification[] = [];

// ── Notification Provider Interface ──
export interface NotificationProvider {
  name: string;
  send(userId: string, title: string, message: string, type: string): Promise<boolean>;
}

// ── Adapters ──
export class InAppNotificationProvider implements NotificationProvider {
  name = 'InApp';
  async send(userId: string, title: string, message: string, type: any): Promise<boolean> {
    const notif: AppNotification = {
      id: uuidv4(),
      user_id: userId,
      title,
      message,
      type: type || 'INFO',
      read: false,
      created_at: new Date().toISOString(),
    };
    DEMO_NOTIFICATIONS.push(notif);
    // Sort descending
    DEMO_NOTIFICATIONS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return true;
  }
}

export class MockSmsProvider implements NotificationProvider {
  name = 'MockSMS';
  async send(userId: string, title: string, message: string): Promise<boolean> {
    logger.info(`[SMS to ${userId}] ${title}: ${message}`);
    return true;
  }
}

// ── Main Service ──
export class NotificationService {
  private providers: NotificationProvider[] = [];

  constructor() {
    this.registerProvider(new InAppNotificationProvider());
    this.registerProvider(new MockSmsProvider());
  }

  registerProvider(provider: NotificationProvider) {
    this.providers.push(provider);
  }

  async dispatch(userId: string, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') {
    logger.info(`Dispatching notification to ${userId}: ${title}`);
    for (const provider of this.providers) {
      try {
        await provider.send(userId, title, message, type);
      } catch (err: any) {
        logger.error(`[NotificationService] Provider ${provider.name} failed: ${err.message}`);
      }
    }
  }

  async getMyNotifications(userId: string): Promise<AppNotification[]> {
    return DEMO_NOTIFICATIONS.filter(n => n.user_id === userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const n = DEMO_NOTIFICATIONS.find(x => x.id === notificationId);
    if (n) n.read = true;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
