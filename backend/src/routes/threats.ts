import { Router } from 'express';
import { threatController } from '../controllers/threatController';
import { authMiddleware } from '../middleware/auth';
import { validateThreat } from '../middleware/validation';

const router = Router();

// All threat routes require authentication
router.use(authMiddleware);

// Threat CRUD routes
router.get('/', threatController.getThreats);
router.get('/search', threatController.searchThreats);
router.get('/stats', threatController.getThreatStats);
router.get('/:id', threatController.getThreatById);
router.post('/', validateThreat.create, threatController.createThreat);
router.put('/:id', validateThreat.update, threatController.updateThreat);
router.delete('/:id', threatController.deleteThreat);

// Bulk operations
router.post('/bulk', threatController.bulkCreateThreats);
router.delete('/bulk', threatController.bulkDeleteThreats);

export default router;