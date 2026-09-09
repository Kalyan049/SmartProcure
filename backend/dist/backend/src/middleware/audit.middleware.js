"use strict";
/**
 * Audit Middleware — Module 5
 *
 * Automatically logs write operations (POST, PUT, PATCH, DELETE) to the audit log.
 * Hooks into the response finish event so req.user is available even if
 * auth middleware is applied at the route level.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditMiddleware = void 0;
const audit_service_1 = require("../modules/auth/audit.service");
const auditMiddleware = (req, res, next) => {
    // Only audit state-changing requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    const start = Date.now();
    res.on('finish', async () => {
        // Only log if the request was successful
        if (res.statusCode >= 400) {
            return;
        }
        const duration = Date.now() - start;
        const actorId = req.user?.id || req.headers['x-farmer-id'] || 'system';
        const actorRole = req.user?.role || 'SYSTEM';
        // Best-effort extraction of entity ID from URL or body
        let entityId = 'unknown';
        // Check if URL ends with an ID (e.g. /api/users/123)
        const urlParts = req.originalUrl.split('?')[0].split('/');
        const lastPart = urlParts[urlParts.length - 1];
        // Simple heuristic: if the last part is a UUID or a number, it's probably the entity ID
        const isId = /^[0-9a-fA-F-]{36}$/.test(lastPart) || /^\d+$/.test(lastPart) || lastPart.startsWith('SP-');
        if (isId) {
            entityId = lastPart;
        }
        else if (req.body && req.body.id) {
            entityId = String(req.body.id);
        }
        // Determine entity type from URL (e.g. /api/centers -> centers)
        const basePathIndex = urlParts.indexOf('api');
        const entityType = basePathIndex !== -1 && urlParts.length > basePathIndex + 1
            ? urlParts[basePathIndex + 1]
            : 'system';
        const action = `${req.method}_${entityType}`.toUpperCase();
        // Do not await, fire and forget
        (0, audit_service_1.logAction)({
            actor_id: actorId === 'anonymous' ? null : actorId,
            actor_role: actorRole,
            action: action,
            entity_type: entityType,
            entity_id: entityId,
            metadata: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                statusCode: res.statusCode
            }
        });
    });
    next();
};
exports.auditMiddleware = auditMiddleware;
