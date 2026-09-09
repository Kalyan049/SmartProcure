/**
 * SmartProcure Auth Controller — Module 5: Authentication & Role-Based Access
 *
 * HTTP request handlers for auth endpoints. Uses Zod for input validation.
 * Delegates all business logic to auth.service.ts.
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import {
  sendOtp,
  verifyOtp,
  registerFarmer,
  getUserProfile,
  updateUserProfile,
} from './auth.service';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const SendOtpSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
});

const VerifyOtpSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

const RegisterSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  preferredLanguage: z.enum(['en', 'hi', 'te']).default('en'),
  landSizeAcres: z.number().min(0).default(0),
  landVillage: z.string().default(''),
  landDistrict: z.string().default(''),
  landState: z.string().default(''),
  primaryCrop: z.string().default('Paddy'),
  allCropsGrown: z.array(z.string()).default([]),
  aadhaarLast4: z.string().length(4).optional(),
});

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  language: z.enum(['en', 'hi', 'te']).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

// ─── Controller ───────────────────────────────────────────────────────────────

export class AuthController {
  /**
   * POST /auth/send-otp
   * Body: { mobile: string }
   */
  static async handleSendOtp(req: Request, res: Response) {
    const parsed = SendOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
    }

    const result = await sendOtp(parsed.data.mobile);

    if (!result.success) {
      return ApiResponseHandler.error(res, result.error || 'Failed to send OTP', 400, result.errorCode);
    }

    return ApiResponseHandler.success(res, result.data, 'OTP sent successfully');
  }

  /**
   * POST /auth/verify-otp
   * Body: { mobile: string, otp: string }
   */
  static async handleVerifyOtp(req: Request, res: Response) {
    const parsed = VerifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
    }

    const result = await verifyOtp(parsed.data.mobile, parsed.data.otp);

    if (!result.success) {
      const statusCode = result.errorCode === 'INVALID_OTP' ? 401 : 400;
      return ApiResponseHandler.error(res, result.error || 'Verification failed', statusCode, result.errorCode);
    }

    return ApiResponseHandler.success(res, result.data, 'Authentication successful');
  }

  /**
   * POST /auth/register
   * Body: FarmerRegistrationInput
   */
  static async handleRegister(req: Request, res: Response) {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
    }

    const result = await registerFarmer(parsed.data);

    if (!result.success) {
      const statusCode = result.errorCode === 'ALREADY_REGISTERED' ? 409 : 400;
      return ApiResponseHandler.error(res, result.error || 'Registration failed', statusCode, result.errorCode);
    }

    return ApiResponseHandler.success(res, result.data, 'Farmer registered successfully', 201);
  }

  /**
   * GET /auth/me
   * Requires: authenticate middleware
   */
  static async handleGetMe(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    const result = await getUserProfile(userId);

    if (!result.success) {
      return ApiResponseHandler.error(res, result.error || 'Profile not found', 404, result.errorCode);
    }

    return ApiResponseHandler.success(res, result.data);
  }

  /**
   * PUT /auth/profile
   * Requires: authenticate middleware
   * Body: { name?, language?, avatar_url? }
   */
  static async handleUpdateProfile(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return ApiResponseHandler.error(res, msg, 400, 'VALIDATION_ERROR');
    }

    const result = await updateUserProfile(userId, parsed.data);

    if (!result.success) {
      return ApiResponseHandler.error(res, result.error || 'Update failed', 400, result.errorCode);
    }

    return ApiResponseHandler.success(res, result.data, 'Profile updated successfully');
  }
}
