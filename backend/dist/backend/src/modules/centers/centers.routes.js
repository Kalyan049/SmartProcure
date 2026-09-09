"use strict";
/**
 * SmartProcure Centers Routes — Module 7: Procurement Center Discovery
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const centers_controller_1 = require("./centers.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// We use authenticateOptional if we want to allow public viewing of centers, 
// but still get the farmer ID if logged in to calculate deterministic distances.
router.get('/', auth_middleware_1.authenticateOptional, centers_controller_1.CentersController.listCenters);
router.get('/:id', auth_middleware_1.authenticateOptional, centers_controller_1.CentersController.getCenterDetail);
router.get('/:id/capacity', auth_middleware_1.authenticateOptional, centers_controller_1.CentersController.getCenterCapacity);
exports.default = router;
