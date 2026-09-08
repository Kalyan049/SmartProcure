/**
 * SmartProcure Supabase Services - Barrel Export
 * Import individual services or use the combined `db` object.
 *
 * Usage:
 *   import { centersService } from '@/services/supabase';
 *   const centers = await centersService.listCenters();
 */
export { centersService } from './centersService';
export { slotsService } from './slotsService';
export { bookingsService } from './bookingsService';
export { queueService } from './queueService';
export { procurementService } from './procurementService';
export { paymentsService } from './paymentsService';
export { notificationsService } from './notificationsService';
export { grievancesService } from './grievancesService';
export { farmerProfileService } from './farmerProfileService';

// Re-export client for advanced usage
export { supabase, isSupabaseConfigured } from '@/lib/supabase';
