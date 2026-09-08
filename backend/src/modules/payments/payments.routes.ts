import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Payment } from '../../../../shared/types';

export const DEMO_PAYMENTS: Payment[] = [
  {
    id: 'pay-10291',
    procurement_id: 'pr-01',
    farmer_id: 'usr-farmer-01',
    crop: 'Paddy (Grade A)',
    accepted_quantity_quintals: 39.2,
    rate_per_quintal: 2300,
    gross_amount: 90160,
    deductions_amount: 560,
    net_amount: 89600,
    status: 'CREDITED',
    transaction_reference: 'DBT-GOV-2026-99214',
    bank_account_masked: 'XXXXXX5892',
    credited_date: '2026-09-08',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

const router = Router();

router.get('/my', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_PAYMENTS);
});

router.get('/:id', (req: Request, res: Response) => {
  const pay = DEMO_PAYMENTS.find((p) => p.id === req.params.id);
  if (!pay) return ApiResponseHandler.error(res, 'Payment not found', 404);
  return ApiResponseHandler.success(res, pay);
});

export default router;
