"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHandler = void 0;
class ApiResponseHandler {
    static success(res, data, message, statusCode = 200) {
        const payload = {
            success: true,
            data,
            message,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(payload);
    }
    static error(res, message, statusCode = 400, code) {
        const payload = {
            success: false,
            message,
            code: code || 'ERROR',
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(payload);
    }
}
exports.ApiResponseHandler = ApiResponseHandler;
