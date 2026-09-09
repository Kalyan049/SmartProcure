"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_controller_1 = require("./queue.controller");
const router = (0, express_1.Router)();
// Farmer Endpoints
router.get('/my', queue_controller_1.QueueController.getMyQueue);
router.get('/should-i-go-now', queue_controller_1.QueueController.getShouldIGoNow);
// Officer Endpoints
router.get('/center/:centerId', queue_controller_1.QueueController.getCenterQueue);
router.post('/advance', queue_controller_1.QueueController.advanceQueue);
exports.default = router;
