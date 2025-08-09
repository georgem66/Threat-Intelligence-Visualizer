import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin only: Get all users
router.get('/', requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;

    const { rows: users, count } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'lastLoginAt', 'isActive'],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;