import { Router } from 'express';
import { PaymentsController } from './payments.controller';

const router = Router();

router.get('/my', PaymentsController.getMyPayments);

export default router;
