import { Router } from 'express';
import { threatController } from '../controllers/threatController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validateThreat, validateQuery } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.get('/', validateQuery.threats, threatController.getThreats);
router.get('/search', threatController.searchThreats);
router.get('/stats', threatController.getThreatStats);
router.get('/:id', threatController.getThreatById);
router.post('/', validateThreat.create, threatController.createThreat);
router.put('/:id', validateThreat.update, threatController.updateThreat);
router.delete('/:id', threatController.deleteThreat);

router.post('/bulk', requireRole('analyst'), threatController.bulkCreateThreats);
router.delete('/bulk', requireRole('admin'), threatController.bulkDeleteThreats);

export default router;
