import { createApp } from './app';
import { ENV } from './config/env';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 SmartProcure Backend API (Version 3.0) is LIVE`);
  logger.info(`📡 Listening on: http://localhost:${ENV.PORT}`);
  logger.info(`🏥 Health Check: http://localhost:${ENV.PORT}/api/health`);
  logger.info(`🌾 Environment:  ${ENV.NODE_ENV}`);
  logger.info(`=======================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});
