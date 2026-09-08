"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.AuthService = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
class AuthService {
    async sendOtp(mobile) {
        // Foundation mock OTP sender
        return { mobile, otpSent: true, expiresInSec: 300, demoOtp: '123456' };
    }
    async verifyOtp(mobile, otp) {
        // Foundation mock OTP verifier
        if (otp === '123456' || otp === '999999') {
            const isOfficer = mobile === '9999999999';
            return {
                token: `mock-jwt-token-${Date.now()}`,
                user: {
                    id: isOfficer ? 'usr-officer-01' : 'usr-farmer-01',
                    name: isOfficer ? 'Procurement Officer' : 'Ramesh Kumar',
                    mobile,
                    role: isOfficer ? 'OFFICER' : 'FARMER',
                    language: 'en',
                    created_at: new Date().toISOString(),
                },
            };
        }
        throw new Error('Invalid OTP. Use 123456 for demo.');
    }
    async getCurrentUser(userId) {
        return {
            id: userId,
            name: 'Ramesh Kumar',
            mobile: '9876543210',
            role: 'FARMER',
            language: 'en',
            created_at: new Date().toISOString(),
        };
    }
}
exports.AuthService = AuthService;
const authService = new AuthService();
class AuthController {
    static async sendOtp(req, res) {
        try {
            const { mobile } = req.body;
            if (!mobile)
                return apiResponse_1.ApiResponseHandler.error(res, 'Mobile number is required', 400);
            const result = await authService.sendOtp(mobile);
            return apiResponse_1.ApiResponseHandler.success(res, result, 'OTP sent successfully');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Error sending OTP';
            return apiResponse_1.ApiResponseHandler.error(res, msg, 400);
        }
    }
    static async verifyOtp(req, res) {
        try {
            const { mobile, otp } = req.body;
            if (!mobile || !otp)
                return apiResponse_1.ApiResponseHandler.error(res, 'Mobile and OTP are required', 400);
            const result = await authService.verifyOtp(mobile, otp);
            return apiResponse_1.ApiResponseHandler.success(res, result, 'Authentication successful');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Authentication failed';
            return apiResponse_1.ApiResponseHandler.error(res, msg, 401);
        }
    }
    static async getMe(req, res) {
        const user = req.user;
        const result = await authService.getCurrentUser(user?.id || 'usr-farmer-demo-01');
        return apiResponse_1.ApiResponseHandler.success(res, result);
    }
}
exports.AuthController = AuthController;
const router = (0, express_1.Router)();
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.get('/me', AuthController.getMe);
exports.default = router;
