"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = require("./payments.controller");
const router = (0, express_1.Router)();
router.get('/my', payments_controller_1.PaymentsController.getMyPayments);
exports.default = router;
