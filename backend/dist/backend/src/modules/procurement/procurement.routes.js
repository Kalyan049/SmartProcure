"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const procurement_controller_1 = require("./procurement.controller");
const router = (0, express_1.Router)();
router.get('/my', procurement_controller_1.ProcurementController.getMyProcurement);
router.get('/:id', procurement_controller_1.ProcurementController.getProcurement);
router.post('/:id/advance', procurement_controller_1.ProcurementController.advanceStage);
exports.default = router;
