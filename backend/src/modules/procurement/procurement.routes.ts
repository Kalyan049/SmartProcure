import { Router } from 'express';
import { ProcurementController } from './procurement.controller';

const router = Router();

router.get('/my', ProcurementController.getMyProcurement);
router.get('/:id', ProcurementController.getProcurement);
router.post('/:id/advance', ProcurementController.advanceStage);

export default router;
