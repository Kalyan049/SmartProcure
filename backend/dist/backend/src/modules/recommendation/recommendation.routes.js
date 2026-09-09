"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendation_controller_1 = require("./recommendation.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// /recommendation route
router.post('/', auth_middleware_1.authenticateOptional, recommendation_controller_1.RecommendationController.calculate);
exports.default = router;
