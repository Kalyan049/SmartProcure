"use strict";
/**
 * SmartProcure Auth Controller — Module 5: Authentication & Role-Based Access
 *
 * HTTP request handlers for auth endpoints. Uses Zod for input validation.
 * Delegates all business logic to auth.service.ts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../../utils/apiResponse");
const auth_service_1 = require("./auth.service");
// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const SendOtpSchema = zod_1.z.object({
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
});
const VerifyOtpSchema = zod_1.z.object({
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
    otp: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});
const RegisterSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters'),
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
    preferredLanguage: zod_1.z.enum(['en', 'hi', 'te']).default('en'),
    landSizeAcres: zod_1.z.number().min(0).default(0),
    landVillage: zod_1.z.string().default(''),
    landDistrict: zod_1.z.string().default(''),
    landState: zod_1.z.string().default(''),
    primaryCrop: zod_1.z.string().default('Paddy'),
    allCropsGrown: zod_1.z.array(zod_1.z.string()).default([]),
    aadhaarLast4: zod_1.z.string().length(4).optional(),
});
const UpdateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    language: zod_1.z.enum(['en', 'hi', 'te']).optional(),
    avatar_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
// ─── Controller ───────────────────────────────────────────────────────────────
class AuthController {
    /**
     * POST /auth/send-otp
     * Body: { mobile: string }
     */
    static async handleSendOtp(req, res) {
        const parsed = SendOtpSchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map((e) => e.message).join('; ');
            return apiResponse_1.ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
        }
        const result = await (0, auth_service_1.sendOtp)(parsed.data.mobile);
        if (!result.success) {
            return apiResponse_1.ApiResponseHandler.error(res, result.error || 'Failed to send OTP', 400, result.errorCode);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result.data, 'OTP sent successfully');
    }
    /**
     * POST /auth/verify-otp
     * Body: { mobile: string, otp: string }
     */
    static async handleVerifyOtp(req, res) {
        const parsed = VerifyOtpSchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map((e) => e.message).join('; ');
            return apiResponse_1.ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
        }
        const result = await (0, auth_service_1.verifyOtp)(parsed.data.mobile, parsed.data.otp);
        if (!result.success) {
            const statusCode = result.errorCode === 'INVALID_OTP' ? 401 : 400;
            return apiResponse_1.ApiResponseHandler.error(res, result.error || 'Verification failed', statusCode, result.errorCode);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result.data, 'Authentication successful');
    }
    /**
     * POST /auth/register
     * Body: FarmerRegistrationInput
     */
    static async handleRegister(req, res) {
        const parsed = RegisterSchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map((e) => e.message).join('; ');
            return apiResponse_1.ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
        }
        const result = await (0, auth_service_1.registerFarmer)(parsed.data);
        if (!result.success) {
            const statusCode = result.errorCode === 'ALREADY_REGISTERED' ? 409 : 400;
            return apiResponse_1.ApiResponseHandler.error(res, result.error || 'Registration failed', statusCode, result.errorCode);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result.data, 'Farmer registered successfully', 201);
    }
    /**
     * GET /auth/me
     * Requires: authenticate middleware
     */
    static async handleGetMe(req, res) {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
        }
        const result = await (0, auth_service_1.getUserProfile)(userId);
        if (!result.success) {
            return apiResponse_1.ApiResponseHandler.error(res, result.error || 'Profile not found', 404, result.errorCode);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result.data);
    }
    /**
     * PUT /auth/profile
     * Requires: authenticate middleware
     * Body: { name?, language?, avatar_url? }
     */
    static async handleUpdateProfile(req, res) {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
        }
        const parsed = UpdateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map((e) => e.message).join('; ');
            return apiResponse_1.ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
        }
        const result = await (0, auth_service_1.updateUserProfile)(userId, parsed.data);
        if (!result.success) {
            return apiResponse_1.ApiResponseHandler.error(res, result.error || 'Update failed', 400, result.errorCode);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result.data, 'Profile updated successfully');
    }
}
exports.AuthController = AuthController;
