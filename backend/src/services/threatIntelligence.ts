import axios from 'axios';
import * as cron from 'node-cron';
import { Threat } from '../models/Threat';
import { logger } from '../utils/logger';

interface ThreatFeed {
  sourceIp: string;
  category: 'malware' | 'phishing' | 'botnet' | 'spam' | 'scanning' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  source: string;
  geolocation?: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

class ThreatIntelligenceService {
  private isRunning = false;

  async fetchAbuseIPDB(): Promise<ThreatFeed[]> {
    try {
      const mockData: ThreatFeed[] = [
        {
          sourceIp: '192.168.1.100',
          category: 'scanning',
          severity: 'medium',
          confidence: 85,
          description: 'Port scanning activity detected',
          source: 'AbuseIPDB',
          geolocation: {
            country: 'United States',
            countryCode: 'US',
            region: 'California',
            city: 'San Francisco',
            latitude: 37.7749,
            longitude: -122.4194,
          },
        },
        {
          sourceIp: '10.0.0.50',
          category: 'malware',
          severity: 'high',
          confidence: 95,
          description: 'Malware C&C communication',
          source: 'AbuseIPDB',
          geolocation: {
            country: 'Russia',
            countryCode: 'RU',
            region: 'Moscow',
            city: 'Moscow',
            latitude: 55.7558,
            longitude: 37.6173,
          },
        },
      ];

      return mockData;
    } catch (error) {
      logger.error('Error fetching AbuseIPDB data:', error);
      return [];
    }
  }

  async fetchMalwareBazaar(): Promise<ThreatFeed[]> {
    try {
      const mockData: ThreatFeed[] = [
        {
          sourceIp: '172.16.0.25',
          category: 'malware',
          severity: 'critical',
          confidence: 98,
          description: 'Active malware distribution',
          source: 'MalwareBazaar',
          geolocation: {
            country: 'China',
            countryCode: 'CN',
            region: 'Beijing',
            city: 'Beijing',
            latitude: 39.9042,
            longitude: 116.4074,
          },
        },
      ];

      return mockData;
    } catch (error) {
      logger.error('Error fetching MalwareBazaar data:', error);
      return [];
    }
  }

  async fetchPhishTank(): Promise<ThreatFeed[]> {
    try {
      const mockData: ThreatFeed[] = [
        {
          sourceIp: '203.0.113.15',
          category: 'phishing',
          severity: 'high',
          confidence: 90,
          description: 'Phishing website hosting',
          source: 'PhishTank',
          geolocation: {
            country: 'Germany',
            countryCode: 'DE',
            region: 'Berlin',
            city: 'Berlin',
            latitude: 52.5200,
            longitude: 13.4050,
          },
        },
      ];

      return mockData;
    } catch (error) {
      logger.error('Error fetching PhishTank data:', error);
      return [];
    }
  }

  async fetchCustomFeeds(): Promise<ThreatFeed[]> {
    try {
      const mockData: ThreatFeed[] = [
        {
          sourceIp: '198.51.100.42',
          category: 'botnet',
          severity: 'high',
          confidence: 88,
          description: 'Botnet command and control',
          source: 'CustomFeed',
          geolocation: {
            country: 'United Kingdom',
            countryCode: 'GB',
            region: 'England',
            city: 'London',
            latitude: 51.5074,
            longitude: -0.1278,
          },
        },
        {
          sourceIp: '192.0.2.123',
          category: 'spam',
          severity: 'low',
          confidence: 65,
          description: 'Spam email source',
          source: 'CustomFeed',
          geolocation: {
            country: 'Canada',
            countryCode: 'CA',
            region: 'Ontario',
            city: 'Toronto',
            latitude: 43.6532,
            longitude: -79.3832,
          },
        },
      ];

      return mockData;
    } catch (error) {
      logger.error('Error fetching custom feeds:', error);
      return [];
    }
  }

  async processThreats(threats: ThreatFeed[]): Promise<void> {
    for (const threatData of threats) {
      try {
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
            description: threatData.description,
            geolocation: threatData.geolocation || existingThreat.geolocation,
          });
        } else {
          await Threat.create({
            sourceIp: threatData.sourceIp,
            category: threatData.category,
            severity: threatData.severity,
            confidence: threatData.confidence,
            description: threatData.description,
            source: threatData.source,
            protocol: 'TCP',
            geolocation: threatData.geolocation,
            firstSeen: new Date(),
            lastSeen: new Date(),
            count: 1,
            isActive: true,
          });
        }
      } catch (error) {
        logger.error(`Error processing threat ${threatData.sourceIp}:`, error);
      }
    }
  }

  async collectThreatIntelligence(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Threat intelligence collection already running, skipping');
      return;
    }

    this.isRunning = true;
    logger.info('Starting threat intelligence collection');

    try {
      const [abuseIPDB, malwareBazaar, phishTank, customFeeds] = await Promise.all([
        this.fetchAbuseIPDB(),
        this.fetchMalwareBazaar(),
        this.fetchPhishTank(),
        this.fetchCustomFeeds(),
      ]);

      const allThreats = [
        ...abuseIPDB,
        ...malwareBazaar,
        ...phishTank,
        ...customFeeds,
      ];

      logger.info(`Collected ${allThreats.length} threat intelligence items`);

      await this.processThreats(allThreats);

      logger.info('Threat intelligence collection completed successfully');
    } catch (error) {
      logger.error('Error during threat intelligence collection:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async cleanupOldThreats(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const updatedCount = await Threat.update(
        { isActive: false },
        {
          where: {
            lastSeen: { $lt: thirtyDaysAgo },
            isActive: true,
          }
        }
      );

      logger.info(`Deactivated ${updatedCount[0]} old threats`);
    } catch (error) {
      logger.error('Error cleaning up old threats:', error);
    }
  }

  startScheduledCollection(): void {
    cron.schedule('*/15 * * * *', async () => {
      await this.collectThreatIntelligence();
    });

    cron.schedule('0 2 * * *', async () => {
      await this.cleanupOldThreats();
    });

    logger.info('Threat intelligence collection scheduled');
  }

  async manualCollection(): Promise<void> {
    await this.collectThreatIntelligence();
  }
}

export const threatIntelligenceService = new ThreatIntelligenceService();
