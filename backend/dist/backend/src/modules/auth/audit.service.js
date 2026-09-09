"use strict";
/**
 * SmartProcure Audit Service — Module 5: Authentication & Role-Based Access
 *
 * Handles writing to the audit_logs table for security and compliance tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = logAction;
const supabase_1 = require("../../config/supabase");
const logger_1 = require("../../utils/logger");
async function logAction(entry) {
    // ── Mock mode ─────────────────────────────────────────────────────────────
    if (!(0, supabase_1.isDatabaseConfigured)() || !supabase_1.supabase) {
        logger_1.logger.info(`[Audit Log] [${entry.action}] by ${entry.actor_role} on ${entry.entity_type}:${entry.entity_id}`);
        return;
    }
    // ── Supabase mode ─────────────────────────────────────────────────────────
    try {
        const { error } = await supabase_1.supabase.from('audit_logs').insert({
            actor_id: entry.actor_id,
            actor_role: entry.actor_role,
            action: entry.action,
            entity_type: entry.entity_type,
            entity_id: entry.entity_id,
            metadata: entry.metadata || {},
        });
        if (error) {
            logger_1.logger.error('[Audit Log] Failed to insert audit log entry:', error);
        }
    }
    catch (err) {
        logger_1.logger.error('[Audit Log] Exception inserting audit log entry:', err);
    }
}
