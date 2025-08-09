import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Threat } from '../models/Threat';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

class ThreatController {
  async getThreats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      
      const { type, category, severity, source, startDate, endDate } = req.query;
      
      const whereClause: any = {};
      
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (severity) whereClause.severity = severity;
      if (source) whereClause.source = { [Op.iLike]: `%${source}%` };
      
      if (startDate || endDate) {
        whereClause.firstSeen = {};
        if (startDate) whereClause.firstSeen[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.firstSeen[Op.lte] = new Date(endDate as string);
      }

      const { rows: threats, count } = await Threat.findAndCountAll({
        where: whereClause,
        order: [['lastSeen', 'DESC']],
        limit,
        offset,
      });

      res.json({
        threats,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error('Error fetching threats:', error);
      next(error);
    }
  }

  async searchThreats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const whereClause: any = {
        [Op.or]: [
          { value: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { tags: { [Op.contains]: [q as string] } },
        ],
      };

      if (type) {
        whereClause.type = type;
      }

      const threats = await Threat.findAll({
        where: whereClause,
        order: [['lastSeen', 'DESC']],
        limit: 50,
      });

      res.json({ threats });
    } catch (error) {
      logger.error('Error searching threats:', error);
      next(error);
    }
  }

  async getThreatStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalThreats,
        categoryCounts,
        severityCounts,
        recentThreats
      ] = await Promise.all([
        Threat.count(),
        Threat.findAll({
          attributes: [
            'category',
            [Threat.sequelize!.fn('COUNT', '*'), 'count']
          ],
          group: 'category',
          raw: true,
        }),
        Threat.findAll({
          attributes: [
            'severity',
            [Threat.sequelize!.fn('COUNT', '*'), 'count']
          ],
          group: 'severity',
          raw: true,
        }),
        Threat.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      res.json({
        totalThreats,
        recentThreats,
        categoryCounts: categoryCounts.reduce((acc: any, item: any) => {
          acc[item.category] = parseInt(item.count);
          return acc;
        }, {}),
        severityCounts: severityCounts.reduce((acc: any, item: any) => {
          acc[item.severity] = parseInt(item.count);
          return acc;
        }, {}),
      });
    } catch (error) {
      logger.error('Error fetching threat stats:', error);
      next(error);
    }
  }

  async getThreatById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const threat = await Threat.findByPk(id);
      if (!threat) {
        throw createError('Threat not found', 404);
      }

      res.json({ threat });
    } catch (error) {
      next(error);
    }
  }

  async createThreat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const threatData = req.body;
      
      // Check if threat already exists
      const existingThreat = await Threat.findOne({
        where: {
          value: threatData.value,
          type: threatData.type,
        },
      });

      if (existingThreat) {
        // Update existing threat
        await existingThreat.update({
          ...threatData,
          lastSeen: new Date(),
        });
        res.json({ threat: existingThreat, updated: true });
        return;
      }

      const threat = await Threat.create(threatData);
      logger.info(`New threat created: ${threat.type} - ${threat.value}`);

      res.status(201).json({ threat });
    } catch (error) {
      logger.error('Error creating threat:', error);
      next(error);
    }
  }

  async updateThreat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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
        throw createError('Threat not found', 404);
      }

      await threat.update({
        ...updateData,
        lastSeen: new Date(),
      });

      res.json({ threat });
    } catch (error) {
      next(error);
    }
  }

  async deleteThreat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const threat = await Threat.findByPk(id);
      if (!threat) {
        throw createError('Threat not found', 404);
      }

      await threat.destroy();
      logger.info(`Threat deleted: ${id}`);

      res.json({ message: 'Threat deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async bulkCreateThreats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { threats } = req.body;
      
      if (!Array.isArray(threats) || threats.length === 0) {
        res.status(400).json({ error: 'Threats array is required' });
        return;
      }

      const results = await Promise.allSettled(
        threats.map(async (threatData: any) => {
          const existingThreat = await Threat.findOne({
            where: {
              value: threatData.value,
              type: threatData.type,
            },
          });

          if (existingThreat) {
            return existingThreat.update({
              ...threatData,
              lastSeen: new Date(),
            });
          }

          return Threat.create(threatData);
        })
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`Bulk threat operation completed: ${successful} successful, ${failed} failed`);

      res.json({
        message: 'Bulk operation completed',
        successful,
        failed,
        total: threats.length,
      });
    } catch (error) {
      logger.error('Error in bulk create threats:', error);
      next(error);
    }
  }

  async bulkDeleteThreats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'IDs array is required' });
        return;
      }

      const deletedCount = await Threat.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });

      logger.info(`Bulk deleted ${deletedCount} threats`);

      res.json({
        message: 'Bulk delete completed',
        deletedCount,
      });
    } catch (error) {
      logger.error('Error in bulk delete threats:', error);
      next(error);
    }
  }
}

export const threatController = new ThreatController();