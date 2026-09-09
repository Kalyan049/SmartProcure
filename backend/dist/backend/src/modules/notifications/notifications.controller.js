"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const notifications_service_1 = require("./notifications.service");
class NotificationController {
    static async getMyNotifications(req, res) {
        const userId = req.user?.id || 'usr-farmer-01'; // Mock MVP ID
        const notifications = await notifications_service_1.notificationService.getMyNotifications(userId);
        return apiResponse_1.ApiResponseHandler.success(res, notifications);
    }
    static async markRead(req, res) {
        await notifications_service_1.notificationService.markAsRead(req.params.id);
        return apiResponse_1.ApiResponseHandler.success(res, { success: true });
    }
}
exports.NotificationController = NotificationController;
