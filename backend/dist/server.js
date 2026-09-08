"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const app = (0, app_1.createApp)();
const server = app.listen(env_1.ENV.PORT, () => {
    logger_1.logger.info(`=======================================================`);
    logger_1.logger.info(`🚀 SmartProcure Backend API (Version 3.0) is LIVE`);
    logger_1.logger.info(`📡 Listening on: http://localhost:${env_1.ENV.PORT}`);
    logger_1.logger.info(`🏥 Health Check: http://localhost:${env_1.ENV.PORT}/api/health`);
    logger_1.logger.info(`🌾 Environment:  ${env_1.ENV.NODE_ENV}`);
    logger_1.logger.info(`=======================================================`);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger_1.logger.info('Server closed.');
        process.exit(0);
    });
});
