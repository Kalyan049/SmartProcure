"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = require("../utils/logger");
class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    logger_1.logger.error(`Error handling ${req.method} ${req.originalUrl}:`, err);
    if (err instanceof AppError) {
        return apiResponse_1.ApiResponseHandler.error(res, err.message, err.statusCode, err.code);
    }
    return apiResponse_1.ApiResponseHandler.error(res, process.env.NODE_ENV === 'production'
        ? 'An unexpected internal server error occurred.'
        : err.message || 'Internal Server Error', 500, 'INTERNAL_SERVER_ERROR');
};
exports.errorHandler = errorHandler;
