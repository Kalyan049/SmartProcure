import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';

export class AuthService {
  async sendOtp(mobile: string) {
    // Foundation mock OTP sender
    return { mobile, otpSent: true, expiresInSec: 300, demoOtp: '123456' };
  }

  async verifyOtp(mobile: string, otp: string) {
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

  async getCurrentUser(userId: string) {
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

const authService = new AuthService();

export class AuthController {
  static async sendOtp(req: Request, res: Response) {
    try {
      const { mobile } = req.body;
      if (!mobile) return ApiResponseHandler.error(res, 'Mobile number is required', 400);
      const result = await authService.sendOtp(mobile);
      return ApiResponseHandler.success(res, result, 'OTP sent successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending OTP';
      return ApiResponseHandler.error(res, msg, 400);
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { mobile, otp } = req.body;
      if (!mobile || !otp) return ApiResponseHandler.error(res, 'Mobile and OTP are required', 400);
      const result = await authService.verifyOtp(mobile, otp);
      return ApiResponseHandler.success(res, result, 'Authentication successful');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      return ApiResponseHandler.error(res, msg, 401);
    }
  }

  static async getMe(req: Request, res: Response) {
    const user = (req as unknown as { user?: { id: string } }).user;
    const result = await authService.getCurrentUser(user?.id || 'usr-farmer-demo-01');
    return ApiResponseHandler.success(res, result);
  }
}

const router = Router();
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.get('/me', AuthController.getMe);

export default router;
