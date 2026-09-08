"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const authenticate = (req, res, next) => {
    // Check for Bearer token or mock demo auth header
    const authHeader = req.headers.authorization;
    const mockUserId = req.headers['x-mock-user-id'];
    const mockRole = req.headers['x-mock-role'] || 'FARMER';
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
        apiResponse_1.ApiResponseHandler.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
        return;
    }
    // Token decoding / verification hook
    next();
};
exports.authenticate = authenticate;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            apiResponse_1.ApiResponseHandler.error(res, 'Access denied: insufficient permissions', 403, 'FORBIDDEN');
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
