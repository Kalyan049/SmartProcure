"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateOptional = exports.requireRole = exports.authenticate = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const mockUserId = req.headers['x-mock-user-id'];
    const mockRole = req.headers['x-mock-role'] || 'FARMER';
    // 1. Mock header override (for testing without JWTs)
    if (mockUserId && !(0, supabase_1.isDatabaseConfigured)()) {
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
        if (process.env.NODE_ENV !== 'production' && !(0, supabase_1.isDatabaseConfigured)()) {
            req.user = {
                id: 'usr-farmer-demo-01',
                role: 'FARMER',
                mobile: '9876543210',
                name: 'Ramesh Kumar',
            };
            return next();
        }
        apiResponse_1.ApiResponseHandler.error(res, 'Authentication required: Missing Bearer token', 401, 'UNAUTHORIZED');
        return;
    }
    const token = authHeader.split(' ')[1];
    // 3. Verify Token
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        try {
            const { data: { user: authUser }, error } = await supabase_1.supabase.auth.getUser(token);
            if (error || !authUser) {
                logger_1.logger.warn(`[Auth] Invalid Supabase token: ${error?.message}`);
                apiResponse_1.ApiResponseHandler.error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
                return;
            }
            // We need to fetch the app-specific role from public.users
            const { data: appUser, error: appUserError } = await supabase_1.supabase
                .from('users')
                .select('id, name, mobile, role')
                .eq('id', authUser.id)
                .single();
            if (appUserError || !appUser) {
                logger_1.logger.warn(`[Auth] User record not found for auth ID: ${authUser.id}`);
                apiResponse_1.ApiResponseHandler.error(res, 'User profile not found', 404, 'PROFILE_NOT_FOUND');
                return;
            }
            req.user = {
                id: appUser.id,
                role: appUser.role,
                mobile: appUser.mobile,
                name: appUser.name,
            };
            return next();
        }
        catch (err) {
            logger_1.logger.error('[Auth] Token verification error:', err);
            apiResponse_1.ApiResponseHandler.error(res, 'Authentication failed', 500, 'AUTH_ERROR');
            return;
        }
    }
    else {
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
        apiResponse_1.ApiResponseHandler.error(res, 'Invalid mock token format', 401, 'INVALID_TOKEN');
        return;
    }
};
exports.authenticate = authenticate;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            apiResponse_1.ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            logger_1.logger.warn(`[Auth] Access denied: User ${req.user.id} (${req.user.role}) attempted to access restricted route.`);
            apiResponse_1.ApiResponseHandler.error(res, 'Access denied: insufficient permissions', 403, 'FORBIDDEN');
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Optional authentication: attaches user info when a valid token is present,
 * but allows the request through even when unauthenticated.
 * Used for public-but-personalizable endpoints (e.g., center discovery, recommendation).
 */
const authenticateOptional = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Fallback demo user in dev so distances/recommendations are deterministic
            if (process.env.NODE_ENV !== 'production' && !(0, supabase_1.isDatabaseConfigured)()) {
                req.user = {
                    id: 'usr-farmer-demo-01',
                    role: 'FARMER',
                    mobile: '9876543210',
                    name: 'Ramesh Kumar',
                };
            }
            return next();
        }
        const token = authHeader.split(' ')[1];
        if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase.auth.getUser(token);
            if (!error && data.user) {
                const { data: appUser } = await supabase_1.supabase
                    .from('users')
                    .select('id, name, mobile, role')
                    .eq('id', data.user.id)
                    .single();
                if (appUser) {
                    req.user = {
                        id: appUser.id,
                        role: appUser.role,
                        mobile: appUser.mobile,
                        name: appUser.name,
                    };
                }
            }
        }
        else if (token.startsWith('mock-jwt-')) {
            const parts = token.split('-');
            const userId = parts.slice(2, -1).join('-') || 'mock-user-01';
            const mockRole = req.headers['x-mock-role'] || 'FARMER';
            req.user = {
                id: userId,
                role: mockRole,
                mobile: '9876543210',
                name: mockRole === 'OFFICER' ? 'Procurement Officer' : 'Mock Farmer',
            };
        }
    }
    catch {
        // Silently ignore — optional auth never blocks the request
    }
    next();
};
exports.authenticateOptional = authenticateOptional;
