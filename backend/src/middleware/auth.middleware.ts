import { Request, Response, NextFunction } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import { UserRole } from '../../../shared/types';
import { supabase, isDatabaseConfigured } from '../config/supabase';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    mobile: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const mockUserId = req.headers['x-mock-user-id'] as string;
  const mockRole = (req.headers['x-mock-role'] as UserRole) || 'FARMER';

  // 1. Mock header override (for testing without JWTs)
  if (mockUserId && !isDatabaseConfigured()) {
    req.user = {
      id: mockUserId,
      role: mockRole,
      mobile: '9876543210',
      name: mockRole === 'OFFICER' ? 'Procurement Officer' : 'Ramesh Kumar',
    };
    return next();
  }

  // 2. Token Extraction
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In local development / mock mode, assign default demo farmer if unauthenticated
    if (process.env.NODE_ENV !== 'production' && !isDatabaseConfigured()) {
      req.user = {
        id: 'usr-farmer-demo-01',
        role: 'FARMER',
        mobile: '9876543210',
        name: 'Ramesh Kumar',
      };
      return next();
    }
    
    ApiResponseHandler.error(res, 'Authentication required: Missing Bearer token', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];

  // 3. Verify Token
  if (isDatabaseConfigured() && supabase) {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !authUser) {
        logger.warn(`[Auth] Invalid Supabase token: ${error?.message}`);
        ApiResponseHandler.error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
        return;
      }

      // We need to fetch the app-specific role from public.users
      const { data: appUser, error: appUserError } = await supabase
        .from('users')
        .select('id, name, mobile, role')
        .eq('id', authUser.id)
        .single();

      if (appUserError || !appUser) {
        logger.warn(`[Auth] User record not found for auth ID: ${authUser.id}`);
        ApiResponseHandler.error(res, 'User profile not found', 404, 'PROFILE_NOT_FOUND');
        return;
      }

      req.user = {
        id: appUser.id,
        role: appUser.role as UserRole,
        mobile: appUser.mobile,
        name: appUser.name,
      };
      
      return next();
    } catch (err) {
      logger.error('[Auth] Token verification error:', err);
      ApiResponseHandler.error(res, 'Authentication failed', 500, 'AUTH_ERROR');
      return;
    }
  } else {
    // 4. Mock JWT fallback (when Supabase is off but frontend sends a token)
    if (token.startsWith('mock-jwt-')) {
      // Format: mock-jwt-userid-timestamp
      const parts = token.split('-');
      // ID is everything between mock-jwt- and -timestamp
      const userId = parts.slice(2, -1).join('-') || 'mock-user-01'; 
      
      req.user = {
        id: userId,
        role: mockRole, // Rely on header for mock role
        mobile: '9876543210',
        name: mockRole === 'OFFICER' ? 'Procurement Officer' : 'Mock Farmer',
      };
      return next();
    }
    
    ApiResponseHandler.error(res, 'Invalid mock token format', 401, 'INVALID_TOKEN');
    return;
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`[Auth] Access denied: User ${req.user.id} (${req.user.role}) attempted to access restricted route.`);
      ApiResponseHandler.error(res, 'Access denied: insufficient permissions', 403, 'FORBIDDEN');
      return;
    }
    
    next();
  };
};
