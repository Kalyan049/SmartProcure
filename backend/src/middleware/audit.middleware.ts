/**
 * Audit Middleware — Module 5
 *
 * Automatically logs write operations (POST, PUT, PATCH, DELETE) to the audit log.
 * Hooks into the response finish event so req.user is available even if
 * auth middleware is applied at the route level.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { logAction } from '../modules/auth/audit.service';

export const auditMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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
    const actorId = (req as any).user?.id || req.headers['x-farmer-id'] as string || 'system';
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
    } else if (req.body && req.body.id) {
      entityId = String(req.body.id);
    }

    // Determine entity type from URL (e.g. /api/centers -> centers)
    const basePathIndex = urlParts.indexOf('api');
    const entityType = basePathIndex !== -1 && urlParts.length > basePathIndex + 1 
      ? urlParts[basePathIndex + 1] 
      : 'system';

    const action = `${req.method}_${entityType}`.toUpperCase();

    // Do not await, fire and forget
    logAction({
      actor_id: actorId === 'anonymous' ? null : actorId,
      actor_role: actorRole as any,
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
