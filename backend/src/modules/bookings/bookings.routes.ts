import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Booking } from '../../../../shared/types';

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'bk-1047',
    farmer_id: 'usr-farmer-01',
    center_id: 'ctr-02',
    slot_id: 'slt-01',
    crop: 'Paddy',
    quantity_quintals: 40,
    token_number: 'SP-1047',
    qr_code_payload: 'SP:BK1047:F01:C02:PADDY:40',
    status: 'CONFIRMED',
    created_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/my', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_BOOKINGS);
});

router.post('/', (req: Request, res: Response) => {
  const { crop = 'Paddy', quantity = 40, centerId = 'ctr-02', slotId = 'slt-01' } = req.body;
  const newBooking: Booking = {
    id: `bk-${Date.now().toString().slice(-4)}`,
    farmer_id: 'usr-farmer-01',
    center_id: centerId,
    slot_id: slotId,
    crop,
    quantity_quintals: Number(quantity),
    token_number: `SP-${Math.floor(1000 + Math.random() * 9000)}`,
    qr_code_payload: `SP:NEW:${crop}:${quantity}`,
    status: 'CONFIRMED',
    created_at: new Date().toISOString(),
  };
  DEMO_BOOKINGS.unshift(newBooking);
  return ApiResponseHandler.success(res, newBooking, 'Slot booked successfully', 201);
});

router.get('/:id', (req: Request, res: Response) => {
  const booking = DEMO_BOOKINGS.find((b) => b.id === req.params.id);
  if (!booking) return ApiResponseHandler.error(res, 'Booking not found', 404);
  return ApiResponseHandler.success(res, booking);
});

export default router;
