"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const audit_middleware_1 = require("./middleware/audit.middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    // Basic Security & Middlewares
    app.use((0, cors_1.default)({
        origin: [env_1.ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(logger_middleware_1.loggerMiddleware);
    app.use(audit_middleware_1.auditMiddleware);
    // Mount API Root
    app.use('/api', routes_1.default);
    // Global Error Handler
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
