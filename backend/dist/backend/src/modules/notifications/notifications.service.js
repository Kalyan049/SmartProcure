"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = exports.MockSmsProvider = exports.InAppNotificationProvider = exports.DEMO_NOTIFICATIONS = void 0;
const logger_1 = require("../../utils/logger");
// Global mock state
exports.DEMO_NOTIFICATIONS = [];
// ── Adapters ──
class InAppNotificationProvider {
    name = 'InApp';
    async send(userId, title, message, type) {
        const notif = {
            id: Math.random().toString(36).substring(7),
            user_id: userId,
            title,
            message,
            type: type || 'INFO',
            read: false,
            created_at: new Date().toISOString(),
        };
        exports.DEMO_NOTIFICATIONS.push(notif);
        // Sort descending
        exports.DEMO_NOTIFICATIONS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return true;
    }
}
exports.InAppNotificationProvider = InAppNotificationProvider;
class MockSmsProvider {
    name = 'MockSMS';
    async send(userId, title, message) {
        logger_1.logger.info(`[SMS to ${userId}] ${title}: ${message}`);
        return true;
    }
}
exports.MockSmsProvider = MockSmsProvider;
// ── Main Service ──
class NotificationService {
    providers = [];
    constructor() {
        this.registerProvider(new InAppNotificationProvider());
        this.registerProvider(new MockSmsProvider());
    }
    registerProvider(provider) {
        this.providers.push(provider);
    }
    async dispatch(userId, title, message, type = 'INFO') {
        logger_1.logger.info(`Dispatching notification to ${userId}: ${title}`);
        for (const provider of this.providers) {
            try {
                await provider.send(userId, title, message, type);
            }
            catch (err) {
                logger_1.logger.error(`[NotificationService] Provider ${provider.name} failed: ${err.message}`);
            }
        }
    }
    async getMyNotifications(userId) {
        return exports.DEMO_NOTIFICATIONS.filter(n => n.user_id === userId);
    }
    async markAsRead(notificationId) {
        const n = exports.DEMO_NOTIFICATIONS.find(x => x.id === notificationId);
        if (n)
            n.read = true;
    }
}
exports.NotificationService = NotificationService;
// Export singleton instance
exports.notificationService = new NotificationService();
