/**
 * SmartProcure Centers Service — Module 7: Procurement Center Discovery
 *
 * Handles fetching centers from Supabase with fallback to mock data.
 * Applies deterministic distances for the MVP presentation.
 */

import { supabase, isDatabaseConfigured } from '../../config/supabase';
import { ProcurementCenter } from '../../../../shared/types';
import { logger } from '../../utils/logger';

// Base seeded data matching the existing DB scheme
const DEMO_CENTERS: ProcurementCenter[] = [
  {
    id: 'ctr-01',
    name: 'Kashi Mandi Center A',
    code: 'CTR-01',
    address: 'Near NH-19, Industrial Area, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    daily_capacity_quintals: 500,
    current_load_percent: 90,
    processing_rate_min_per_farmer: 8,
    status: 'OPEN',
    load_status: 'HIGH',
    operating_hours: { open: '08:00 AM', close: '06:00 PM' } as any,
    supported_crops: ['Paddy', 'Wheat', 'Maize'],
    contact_phone: '+91 542 2221111',
  },
  {
    id: 'ctr-02',
    name: 'Rohania Agribusiness Center B',
    code: 'CTR-02',
    address: 'GT Road, Rohania, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.2677,
    longitude: 82.9234,
    daily_capacity_quintals: 600,
    current_load_percent: 45,
    processing_rate_min_per_farmer: 6,
    status: 'OPEN',
    load_status: 'NORMAL',
    operating_hours: { open: '08:00 AM', close: '06:00 PM' } as any,
    supported_crops: ['Paddy', 'Wheat', 'Mustard'],
    contact_phone: '+91 542 2222222',
  },
  {
    id: 'ctr-03',
    name: 'Sewapuri Farmer Hub C',
    code: 'CTR-03',
    address: 'Main Market, Sewapuri, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3501,
    longitude: 82.7832,
    daily_capacity_quintals: 400,
    current_load_percent: 30,
    processing_rate_min_per_farmer: 5,
    status: 'OPEN',
    load_status: 'NORMAL',
    operating_hours: { open: '08:30 AM', close: '05:30 PM' } as any,
    supported_crops: ['Paddy', 'Wheat'],
    contact_phone: '+91 542 2223333',
  },
];

// Helper to deterministically generate a distance based on farmer ID and center ID
function calculateMockDistance(farmerId: string, centerId: string): number {
  const hash = (farmerId + centerId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Returns a pseudo-random distance between 2.0 and 15.0 km
  return Number(((hash % 130) / 10 + 2.0).toFixed(1));
}

// Prepare the center data structure for the Smart Recommendation Engine
function enrichCenterData(center: ProcurementCenter, farmerId: string) {
  // Base distance
  const distanceKm = calculateMockDistance(farmerId, center.id);
  
  // Calculate a realistic queue length based on capacity and load
  // If center is at 90% load, queue should be high.
  const baseQueue = Math.round((center.daily_capacity_quintals / 10) * (center.current_load_percent / 100));
  
  // Estimated wait time in minutes
  const estimatedWaitTimeMins = baseQueue * center.processing_rate_min_per_farmer;

  return {
    ...center,
    distanceKm,
    queueLength: baseQueue,
    estimatedWaitTimeMins,
  };
}

export async function getAllCenters(farmerId: string) {
  let centers = DEMO_CENTERS;

  if (isDatabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('procurement_centers').select('*');
      if (!error && data && data.length > 0) {
        centers = data as ProcurementCenter[];
      }
    } catch (err) {
      logger.error('Failed to fetch centers from Supabase, falling back to mock.', err);
    }
  }

  // Enrich all centers with distance and queue data for the requesting farmer
  return centers.map(c => enrichCenterData(c, farmerId)).sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function getCenterById(centerId: string, farmerId: string) {
  let center: ProcurementCenter | undefined;

  if (isDatabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('procurement_centers').select('*').eq('id', centerId).single();
    if (!error && data) center = data as ProcurementCenter;
  }

  if (!center) {
    center = DEMO_CENTERS.find(c => c.id === centerId);
  }

  if (!center) return null;

  return enrichCenterData(center, farmerId);
}
