import { Request, Response, NextFunction } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import { UserRole } from '../../../shared/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    mobile: string;
    name: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Check for Bearer token or mock demo auth header
  const authHeader = req.headers.authorization;
  const mockUserId = req.headers['x-mock-user-id'] as string;
  const mockRole = (req.headers['x-mock-role'] as UserRole) || 'FARMER';

  if (mockUserId) {
    req.user = {
      id: mockUserId,
      role: mockRole,
      mobile: '9876543210',
      name: mockRole === 'OFFICER' ? 'Procurement Officer' : 'Ramesh Kumar',
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In local development / demo mode, assign default demo farmer if unauthenticated
    if (process.env.NODE_ENV !== 'production') {
      req.user = {
        id: 'usr-farmer-demo-01',
        role: 'FARMER',
        mobile: '9876543210',
        name: 'Ramesh Kumar',
      };
      return next();
    }
    ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
    return;
  }

  // Token decoding / verification hook
  next();
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      ApiResponseHandler.error(res, 'Access denied: insufficient permissions', 403, 'FORBIDDEN');
      return;
    }
    next();
  };
};
