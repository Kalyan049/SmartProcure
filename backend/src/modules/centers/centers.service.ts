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
    current_load_percent: 65,
    processing_rate_min_per_farmer: 12,
    operating_status: 'OPEN',
    supported_crops: ['Paddy', 'Wheat'],
    contact_phone: '+91-9876543210',
    created_at: new Date().toISOString()
  },
  {
    id: 'ctr-02',
    name: 'Rohania Agribusiness Hub',
    code: 'CTR-RH-02',
    address: 'Plot 44, Rohania Bypass, Varanasi, UP',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    daily_capacity_quintals: 600,
    current_load_percent: 45,
    processing_rate_min_per_farmer: 8,
    operating_status: 'OPEN',
    supported_crops: ['Paddy', 'Mustard'],
    contact_phone: '+91-9876543211',
    created_at: new Date().toISOString()
  },
  {
    id: 'ctr-03',
    name: 'Babatpur Logistics Center',
    code: 'CTR-BB-03',
    address: 'Near Airport Road, Babatpur, Varanasi, UP',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.4497,
    longitude: 82.8596,
    daily_capacity_quintals: 800,
    current_load_percent: 88, // High load
    processing_rate_min_per_farmer: 15, // Slower processing
    operating_status: 'OPEN',
    supported_crops: ['Paddy', 'Wheat', 'Maize'],
    contact_phone: '+91-9876543212',
    created_at: new Date().toISOString()
  } as any,
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
