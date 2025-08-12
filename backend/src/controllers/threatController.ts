import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Threat } from '../models/Threat';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { ThreatQueryParams } from '../types';

export const threatController = {
  async getThreats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        page = 1,
        limit = 20,
        category,
        severity,
        source,
        country,
        startDate,
        endDate,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      }: ThreatQueryParams = req.query;

      const offset = (page - 1) * limit;
      const where: WhereOptions = {};

      if (category) {
        where.category = category;
      }

      if (severity) {
        where.severity = severity;
      }

      if (source) {
        where.source = { [Op.iLike]: `%${source}%` };
      }

      if (country) {
        where['geolocation.country'] = { [Op.iLike]: `%${country}%` };
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt[Op.gte] = new Date(startDate);
        }
        if (endDate) {
          where.createdAt[Op.lte] = new Date(endDate);
        }
      }

      if (search) {
        where[Op.or as any] = [
          { sourceIp: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { source: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const threats = await Threat.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
      });

      res.json({
        threats: threats.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: threats.count,
          pages: Math.ceil(threats.count / Number(limit)),
        },
      });
    } catch (error) {
      logger.error('Get threats error:', error);
      next(error);
    }
  },

  async getThreatById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const threat = await Threat.findByPk(id);
      
      if (!threat) {
        res.status(404).json({ error: 'Threat not found' });
        return;
      }

      res.json({ threat });
    } catch (error) {
      logger.error('Get threat by ID error:', error);
      next(error);
    }
  },

  async createThreat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const threatData = req.body;
      
      const existingThreat = await Threat.findOne({
        where: {
          sourceIp: threatData.sourceIp,
          category: threatData.category,
          source: threatData.source,
          isActive: true,
        }
      });

      if (existingThreat) {
        await existingThreat.update({
          count: existingThreat.count + 1,
          lastSeen: new Date(),
          severity: threatData.severity,
          confidence: Math.max(existingThreat.confidence, threatData.confidence),
        });

        res.json({
          message: 'Threat updated',
          threat: existingThreat,
        });
        return;
      }

      const threat = await Threat.create({
        ...threatData,
        firstSeen: new Date(),
        lastSeen: new Date(),
        count: 1,
        isActive: true,
      });

      logger.info(`New threat created: ${threat.sourceIp} (${threat.category})`);

      res.status(201).json({
        message: 'Threat created successfully',
        threat,
      });
    } catch (error) {
      logger.error('Create threat error:', error);
      next(error);
    }
  },

  async updateThreat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      const threat = await Threat.findByPk(id);
      
      if (!threat) {
        res.status(404).json({ error: 'Threat not found' });
        return;
      }

      await threat.update(updateData);

      logger.info(`Threat updated: ID ${id}`);

      res.json({
        message: 'Threat updated successfully',
        threat,
      });
    } catch (error) {
      logger.error('Update threat error:', error);
      next(error);
    }
  },

  async deleteThreat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const threat = await Threat.findByPk(id);
      
      if (!threat) {
        res.status(404).json({ error: 'Threat not found' });
        return;
      }

      await threat.destroy();

      logger.info(`Threat deleted: ID ${id}`);

      res.json({ message: 'Threat deleted successfully' });
    } catch (error) {
      logger.error('Delete threat error:', error);
      next(error);
    }
  },

  async searchThreats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const threats = await Threat.findAll({
        where: {
          [Op.or]: [
            { sourceIp: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
            { source: { [Op.iLike]: `%${q}%` } },
          ],
          isActive: true,
        },
        limit: Number(limit),
        order: [['updatedAt', 'DESC']],
      });

      res.json({ threats });
    } catch (error) {
      logger.error('Search threats error:', error);
      next(error);
    }
  },

  async getThreatStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await Threat.findAll({
        attributes: [
          'category',
          'severity',
          [Threat.sequelize!.fn('COUNT', '*'), 'count']
        ],
        where: { isActive: true },
        group: ['category', 'severity'],
        raw: true,
      });

      const totalThreats = await Threat.count({ where: { isActive: true } });
      const activeThreats = await Threat.count({ 
        where: { 
          isActive: true,
          lastSeen: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        } 
      });

      res.json({
        totalThreats,
        activeThreats,
        stats,
      });
    } catch (error) {
      logger.error('Get threat stats error:', error);
      next(error);
    }
  },

  async bulkCreateThreats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { threats } = req.body;

      if (!Array.isArray(threats) || threats.length === 0) {
        res.status(400).json({ error: 'Threats array is required' });
        return;
      }

      const createdThreats = await Threat.bulkCreate(threats, {
        updateOnDuplicate: ['count', 'lastSeen', 'severity', 'confidence'],
        returning: true,
      });

      logger.info(`Bulk created ${createdThreats.length} threats`);

      res.status(201).json({
        message: `${createdThreats.length} threats processed`,
        threats: createdThreats,
      });
    } catch (error) {
      logger.error('Bulk create threats error:', error);
      next(error);
    }
  },

  async bulkDeleteThreats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'Threat IDs array is required' });
        return;
      }

      const deletedCount = await Threat.destroy({
        where: { id: { [Op.in]: ids } }
      });

      logger.info(`Bulk deleted ${deletedCount} threats`);

      res.json({
        message: `${deletedCount} threats deleted`,
        deletedCount,
      });
    } catch (error) {
      logger.error('Bulk delete threats error:', error);
      next(error);
    }
  },
};
