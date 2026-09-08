import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { ProcurementCenter } from '../../../../shared/types';

export const DEMO_CENTERS: ProcurementCenter[] = [
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
    operating_hours: { open: '08:00 AM', close: '06:00 PM' },
    supported_crops: ['Paddy', 'Wheat', 'Maize'],
    contact_phone: '+91 542 2221111',
    created_at: new Date().toISOString(),
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
    operating_hours: { open: '08:00 AM', close: '06:00 PM' },
    supported_crops: ['Paddy', 'Wheat', 'Mustard'],
    contact_phone: '+91 542 2222222',
    created_at: new Date().toISOString(),
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
    operating_hours: { open: '08:00 AM', close: '05:00 PM' },
    supported_crops: ['Paddy', 'Wheat'],
    contact_phone: '+91 542 2223333',
    created_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_CENTERS);
});

router.get('/:id', (req: Request, res: Response) => {
  const center = DEMO_CENTERS.find((c) => c.id === req.params.id);
  if (!center) return ApiResponseHandler.error(res, 'Center not found', 404);
  return ApiResponseHandler.success(res, center);
});

router.get('/:id/capacity', (req: Request, res: Response) => {
  const center = DEMO_CENTERS.find((c) => c.id === req.params.id);
  if (!center) return ApiResponseHandler.error(res, 'Center not found', 404);
  return ApiResponseHandler.success(res, {
    centerId: center.id,
    daily_capacity_quintals: center.daily_capacity_quintals,
    current_load_percent: center.current_load_percent,
    load_status: center.load_status,
    processing_rate_min_per_farmer: center.processing_rate_min_per_farmer,
    active_queue_count: Math.round((center.current_load_percent / 100) * 80),
  });
});

export default router;
