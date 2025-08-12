import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface AuthRequest extends Request {
  user?: User;
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password, role = 'viewer' } = req.body;

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        username,
        email,
        password: passwordHash,
        role,
        isActive: true,
      });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      logger.info(`User registered: ${username}`);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, password } = req.body;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email: username }],
          isActive: true,
        },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      await user.update({
        lastLogin: new Date(),
      });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      logger.info(`User logged in: ${user.username}`);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
        token,
      });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as { 
          id: number; 
          username: string; 
          role: string; 
        };
        
        const user = await User.findByPk(decoded.id);
        
        if (!user || !user.isActive) {
          res.status(401).json({ error: 'User not found or inactive' });
          return;
        }

        const newToken = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN } as SignOptions
        );

        res.json({
          message: 'Token refreshed successfully',
          token: newToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } catch (jwtError) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  },
};
