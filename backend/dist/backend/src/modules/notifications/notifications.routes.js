"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("./notifications.controller");
const router = (0, express_1.Router)();
router.get('/my', notifications_controller_1.NotificationController.getMyNotifications);
router.post('/:id/read', notifications_controller_1.NotificationController.markRead);
exports.default = router;
