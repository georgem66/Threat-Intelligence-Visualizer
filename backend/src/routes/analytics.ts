import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { Op, QueryTypes } from 'sequelize';
import { authMiddleware } from '../middleware/auth';
import { Threat } from '../models/Threat';
import { Analytics } from '../models/Analytics';
import { sequelize } from '../config/database';

const router = Router();

// All analytics routes require authentication
router.use(authMiddleware);

// Get dashboard analytics
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalThreats,
      threatsLast30Days,
      threatsLast7Days,
      threatsToday,
      topCountries,
      severityDistribution,
      categoryDistribution,
      recentActivity,
    ] = await Promise.all([
      Threat.count(),
      Threat.count({
        where: { createdAt: { [Op.gte]: last30Days } },
      }),
      Threat.count({
        where: { createdAt: { [Op.gte]: last7Days } },
      }),
      Threat.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
      }),
      sequelize.query(`
        SELECT geolocation->>'country' as country, COUNT(*) as count
        FROM threats 
        WHERE geolocation IS NOT NULL 
        AND geolocation->>'country' IS NOT NULL
        GROUP BY geolocation->>'country'
        ORDER BY count DESC
        LIMIT 10
      `, { type: QueryTypes.SELECT }),
      Threat.findAll({
        attributes: [
          'severity',
          [sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: 'severity',
        raw: true,
      }),
      Threat.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: 'category',
        raw: true,
      }),
      Threat.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['id', 'type', 'value', 'category', 'severity', 'source', 'createdAt'],
      }),
    ]);

    res.json({
      overview: {
        totalThreats,
        threatsLast30Days,
        threatsLast7Days,
        threatsToday,
      },
      charts: {
        topCountries: (topCountries as any[]).map((item: any) => ({
          country: item.country || 'Unknown',
          count: parseInt(item.count),
        })),
        severityDistribution: (severityDistribution as any[]).reduce((acc: any, item: any) => {
          acc[item.severity] = parseInt(item.count);
          return acc;
        }, {}),
        categoryDistribution: (categoryDistribution as any[]).reduce((acc: any, item: any) => {
          acc[item.category] = parseInt(item.count);
          return acc;
        }, {}),
      },
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
});

// Get time series data for charts
router.get('/timeseries', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const timeSeriesData = await sequelize.query(`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM threats 
      WHERE "createdAt" >= :startDate
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `, {
      replacements: { startDate },
      type: QueryTypes.SELECT,
    });

    res.json({
      timeSeries: (timeSeriesData as any[]).map((item: any) => ({
        date: item.date,
        count: parseInt(item.count),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get geographic distribution data
router.get('/geographic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const geoData = await sequelize.query(`
      SELECT 
        geolocation->>'country' as country,
        geolocation->>'countryCode' as "countryCode",
        geolocation->>'latitude' as latitude,
        geolocation->>'longitude' as longitude,
        COUNT(*) as count,
        severity,
        category
      FROM threats 
      WHERE geolocation IS NOT NULL 
      AND geolocation->>'latitude' IS NOT NULL
      AND geolocation->>'longitude' IS NOT NULL
      GROUP BY 
        geolocation->>'country',
        geolocation->>'countryCode',
        geolocation->>'latitude',
        geolocation->>'longitude',
        severity,
        category
    `, { type: QueryTypes.SELECT });

    const processedData = (geoData as any[]).map((item: any) => ({
      country: item.country || 'Unknown',
      countryCode: item.countryCode || '',
      latitude: parseFloat(item.latitude) || 0,
      longitude: parseFloat(item.longitude) || 0,
      count: parseInt(item.count),
      severity: item.severity,
      category: item.category,
    }));

    res.json({ geoData: processedData });
  } catch (error) {
    next(error);
  }
});

export default router;