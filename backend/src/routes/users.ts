import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

router.use(authMiddleware);

router.get('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
});

router.get('/', requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      users: users.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: users.count,
        pages: Math.ceil(users.count / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get users error:', error);
    next(error);
  }
});

router.put('/:id', requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await user.update({
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    logger.info(`User updated: ID ${id}`);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
});

router.delete('/:id', requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (Number(id) === (req as AuthRequest).user?.id) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await user.destroy();

    logger.info(`User deleted: ID ${id}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
});

export default router;
