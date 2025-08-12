import { Router, Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Threat } from '../models/Threat';
import { Analytics } from '../models/Analytics';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalThreats = await Threat.count({ where: { isActive: true } });
    
    const activeThreats = await Threat.count({
      where: {
        isActive: true,
        lastSeen: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    const severityCounts = await Threat.findAll({
      attributes: [
        'severity',
        [Threat.sequelize!.fn('COUNT', '*'), 'count']
      ],
      where: { isActive: true },
      group: ['severity'],
      raw: true,
    }) as any[];

    const severityData = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    severityCounts.forEach(item => {
      severityData[item.severity as keyof typeof severityData] = parseInt(item.count);
    });

    const topCountries = await Threat.findAll({
      attributes: [
        [Threat.sequelize!.json('geolocation.country'), 'country'],
        [Threat.sequelize!.fn('COUNT', '*'), 'count']
      ],
      where: {
        isActive: true,
        'geolocation.country': { [Op.ne]: null }
      },
      group: [Threat.sequelize!.json('geolocation.country')],
      order: [[Threat.sequelize!.fn('COUNT', '*'), 'DESC']],
      limit: 10,
      raw: true,
    }) as any[];

    const topCategories = await Threat.findAll({
      attributes: [
        'category',
        [Threat.sequelize!.fn('COUNT', '*'), 'count']
      ],
      where: { isActive: true },
      group: ['category'],
      order: [[Threat.sequelize!.fn('COUNT', '*'), 'DESC']],
      raw: true,
    }) as any[];

    const recentThreats = await Threat.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const threatsByHour = await Threat.findAll({
      attributes: [
        [Threat.sequelize!.fn('DATE_TRUNC', 'hour', Threat.sequelize!.col('createdAt')), 'hour'],
        [Threat.sequelize!.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: last24Hours }
      },
      group: [Threat.sequelize!.fn('DATE_TRUNC', 'hour', Threat.sequelize!.col('createdAt'))],
      order: [[Threat.sequelize!.fn('DATE_TRUNC', 'hour', Threat.sequelize!.col('createdAt')), 'ASC']],
      raw: true,
    }) as any[];

    res.json({
      totalThreats,
      activeThreats,
      criticalThreats: severityData.critical,
      highThreats: severityData.high,
      mediumThreats: severityData.medium,
      lowThreats: severityData.low,
      topCountries: topCountries.map(item => ({
        country: item.country,
        count: parseInt(item.count)
      })),
      topCategories: topCategories.map(item => ({
        category: item.category,
        count: parseInt(item.count)
      })),
      recentThreats,
      threatsByHour: threatsByHour.map(item => ({
        hour: item.hour,
        count: parseInt(item.count)
      })),
    });
  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    next(error);
  }
});

router.get('/timeseries', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate: Date;
    let dateFormat: string;
    
    switch (period) {
      case '1d':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        dateFormat = 'hour';
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
    }

    const timeSeries = await Threat.findAll({
      attributes: [
        [Threat.sequelize!.fn('DATE_TRUNC', dateFormat, Threat.sequelize!.col('createdAt')), 'timestamp'],
        [Threat.sequelize!.fn('COUNT', '*'), 'total'],
        [Threat.sequelize!.fn('COUNT', Threat.sequelize!.literal("CASE WHEN severity = 'critical' THEN 1 END")), 'critical'],
        [Threat.sequelize!.fn('COUNT', Threat.sequelize!.literal("CASE WHEN severity = 'high' THEN 1 END")), 'high'],
        [Threat.sequelize!.fn('COUNT', Threat.sequelize!.literal("CASE WHEN severity = 'medium' THEN 1 END")), 'medium'],
        [Threat.sequelize!.fn('COUNT', Threat.sequelize!.literal("CASE WHEN severity = 'low' THEN 1 END")), 'low'],
      ],
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      group: [Threat.sequelize!.fn('DATE_TRUNC', dateFormat, Threat.sequelize!.col('createdAt'))],
      order: [[Threat.sequelize!.fn('DATE_TRUNC', dateFormat, Threat.sequelize!.col('createdAt')), 'ASC']],
      raw: true,
    }) as any[];

    res.json({
      timeSeries: timeSeries.map(item => ({
        timestamp: item.timestamp,
        total: parseInt(item.total),
        critical: parseInt(item.critical) || 0,
        high: parseInt(item.high) || 0,
        medium: parseInt(item.medium) || 0,
        low: parseInt(item.low) || 0,
      })),
    });
  } catch (error) {
    logger.error('Time series analytics error:', error);
    next(error);
  }
});

router.get('/geographic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const geoData = await Threat.findAll({
      attributes: [
        [Threat.sequelize!.json('geolocation.country'), 'country'],
        [Threat.sequelize!.json('geolocation.countryCode'), 'countryCode'],
        [Threat.sequelize!.json('geolocation.latitude'), 'latitude'],
        [Threat.sequelize!.json('geolocation.longitude'), 'longitude'],
        'severity',
        'category',
        [Threat.sequelize!.fn('COUNT', '*'), 'count']
      ],
      where: {
        isActive: true,
        'geolocation.country': { [Op.ne]: null },
        'geolocation.latitude': { [Op.ne]: null },
        'geolocation.longitude': { [Op.ne]: null },
      },
      group: [
        Threat.sequelize!.json('geolocation.country'),
        Threat.sequelize!.json('geolocation.countryCode'),
        Threat.sequelize!.json('geolocation.latitude'),
        Threat.sequelize!.json('geolocation.longitude'),
        'severity',
        'category'
      ],
      raw: true,
    }) as any[];

    const processedGeoData = geoData
      .filter(item => item.country && item.latitude && item.longitude)
      .map(item => ({
        country: item.country,
        countryCode: item.countryCode,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        count: parseInt(item.count),
        severity: item.severity,
        category: item.category,
      }));

    res.json({ geoData: processedGeoData });
  } catch (error) {
    logger.error('Geographic analytics error:', error);
    next(error);
  }
});

export default router;
