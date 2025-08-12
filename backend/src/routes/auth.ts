import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateAuth } from '../middleware/validation';

const router = Router();

router.post('/register', validateAuth.register, authController.register);
router.post('/login', validateAuth.login, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
