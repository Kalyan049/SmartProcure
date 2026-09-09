/**
 * SmartProcure Audit Service — Module 5: Authentication & Role-Based Access
 *
 * Handles writing to the audit_logs table for security and compliance tracking.
 */

import { supabase, isDatabaseConfigured } from '../../config/supabase';
import { logger } from '../../utils/logger';
import { UserRole } from '../../../../shared/types';

export interface AuditLogEntry {
  actor_id: string;
  actor_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, unknown>;
}

export async function logAction(entry: AuditLogEntry): Promise<void> {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isDatabaseConfigured() || !supabase) {
    logger.info(`[Audit Log] [${entry.action}] by ${entry.actor_role} on ${entry.entity_type}:${entry.entity_id}`);
    return;
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  try {
    const { error } = await supabase.from('audit_logs').insert({
      actor_id: entry.actor_id,
      actor_role: entry.actor_role,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata || {},
    });

    if (error) {
      logger.error('[Audit Log] Failed to insert audit log entry:', error);
    }
  } catch (err) {
    logger.error('[Audit Log] Exception inserting audit log entry:', err);
  }
}
