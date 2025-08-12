import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { createError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Authorization token required', 401, 'MISSING_TOKEN');
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
      
      const user = await User.findByPk(decoded.id);
      
      if (!user || !user.isActive) {
        throw createError('User not found or inactive', 401, 'USER_NOT_FOUND');
      }

      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        throw createError('Token expired', 401, 'TOKEN_EXPIRED');
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        throw createError('Invalid token', 401, 'INVALID_TOKEN');
      }
      throw jwtError;
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
};

export const requireRole = (requiredRole: 'admin' | 'analyst' | 'viewer') => {
  const roleHierarchy = { admin: 3, analyst: 2, viewer: 1 };
  
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED');
      }

      const userRoleLevel = roleHierarchy[req.user.role];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        throw createError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
