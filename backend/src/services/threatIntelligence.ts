import axios from 'axios';
import cron from 'node-cron';
import { Threat } from '../models/Threat';
import { logger } from '../utils/logger';

interface ThreatFeedItem {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  category: 'malware' | 'phishing' | 'botnet' | 'spam' | 'ddos' | 'bruteforce' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  source: string;
  description?: string;
  geolocation?: {
    country?: string;
    countryCode?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
  tags?: string[];
}

class ThreatIntelligenceService {
  private isRunning = false;

  constructor() {
    // Schedule data fetching every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.fetchAllSources();
    });

    logger.info('Threat Intelligence Service initialized');
  }

  async fetchAllSources(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Data fetching already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    logger.info('Starting threat intelligence data fetch...');

    try {
      await Promise.allSettled([
        this.fetchAbuseIPDB(),
        this.fetchMalwareFeeds(),
        this.fetchPhishingFeeds(),
      ]);

      logger.info('Threat intelligence data fetch completed');
    } catch (error) {
      logger.error('Error during threat intelligence fetch:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async fetchAbuseIPDB(): Promise<void> {
    try {
      logger.info('Fetching data from simulated AbuseIPDB...');
      
      // Simulated threat data (in real implementation, you'd call actual APIs)
      const simulatedThreats: ThreatFeedItem[] = [
        {
          type: 'ip',
          value: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          category: 'malware',
          severity: 'high',
          confidence: Math.floor(Math.random() * 30) + 70,
          source: 'AbuseIPDB',
          description: 'Malicious IP address detected in botnet activity',
          geolocation: {
            country: ['United States', 'China', 'Russia', 'Germany', 'Brazil'][Math.floor(Math.random() * 5)],
            countryCode: ['US', 'CN', 'RU', 'DE', 'BR'][Math.floor(Math.random() * 5)],
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
          },
          tags: ['botnet', 'malware'],
        },
        {
          type: 'ip',
          value: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          category: 'ddos',
          severity: 'critical',
          confidence: Math.floor(Math.random() * 20) + 80,
          source: 'AbuseIPDB',
          description: 'IP address involved in DDoS attacks',
          geolocation: {
            country: ['United States', 'China', 'Russia', 'Germany', 'Brazil'][Math.floor(Math.random() * 5)],
            countryCode: ['US', 'CN', 'RU', 'DE', 'BR'][Math.floor(Math.random() * 5)],
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
          },
          tags: ['ddos', 'attack'],
        },
        {
          type: 'ip',
          value: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          category: 'bruteforce',
          severity: 'medium',
          confidence: Math.floor(Math.random() * 40) + 60,
          source: 'AbuseIPDB',
          description: 'IP address performing brute force attacks',
          geolocation: {
            country: ['United States', 'China', 'Russia', 'Germany', 'Brazil'][Math.floor(Math.random() * 5)],
            countryCode: ['US', 'CN', 'RU', 'DE', 'BR'][Math.floor(Math.random() * 5)],
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
          },
          tags: ['bruteforce', 'ssh'],
        },
      ];

      await this.storeThreatData(simulatedThreats);
      logger.info(`Stored ${simulatedThreats.length} threats from AbuseIPDB simulation`);
    } catch (error) {
      logger.error('Error fetching from AbuseIPDB simulation:', error);
    }
  }

  private async fetchMalwareFeeds(): Promise<void> {
    try {
      logger.info('Fetching data from simulated Malware feeds...');
      
      const simulatedThreats: ThreatFeedItem[] = [
        {
          type: 'hash',
          value: this.generateRandomHash(),
          category: 'malware',
          severity: 'high',
          confidence: Math.floor(Math.random() * 20) + 80,
          source: 'MalwareBazaar',
          description: 'Malicious file hash detected',
          tags: ['trojan', 'windows'],
        },
        {
          type: 'domain',
          value: `malware-${Math.random().toString(36).substring(7)}.com`,
          category: 'malware',
          severity: 'critical',
          confidence: Math.floor(Math.random() * 15) + 85,
          source: 'MalwareBazaar',
          description: 'Domain hosting malware',
          tags: ['c2', 'malware'],
        },
        {
          type: 'url',
          value: `https://evil-${Math.random().toString(36).substring(7)}.net/payload.exe`,
          category: 'malware',
          severity: 'high',
          confidence: Math.floor(Math.random() * 20) + 80,
          source: 'URLVoid',
          description: 'Malicious URL hosting payload',
          tags: ['payload', 'download'],
        },
      ];

      await this.storeThreatData(simulatedThreats);
      logger.info(`Stored ${simulatedThreats.length} threats from Malware feeds simulation`);
    } catch (error) {
      logger.error('Error fetching from Malware feeds simulation:', error);
    }
  }

  private async fetchPhishingFeeds(): Promise<void> {
    try {
      logger.info('Fetching data from simulated Phishing feeds...');
      
      const simulatedThreats: ThreatFeedItem[] = [
        {
          type: 'domain',
          value: `phish-${Math.random().toString(36).substring(7)}.com`,
          category: 'phishing',
          severity: 'medium',
          confidence: Math.floor(Math.random() * 30) + 70,
          source: 'PhishTank',
          description: 'Phishing domain mimicking legitimate service',
          tags: ['phishing', 'social-engineering'],
        },
        {
          type: 'url',
          value: `https://fake-bank-${Math.random().toString(36).substring(7)}.org/login`,
          category: 'phishing',
          severity: 'high',
          confidence: Math.floor(Math.random() * 20) + 80,
          source: 'PhishTank',
          description: 'Phishing URL targeting banking credentials',
          tags: ['phishing', 'banking'],
        },
        {
          type: 'email',
          value: `noreply@fake-${Math.random().toString(36).substring(7)}.com`,
          category: 'spam',
          severity: 'low',
          confidence: Math.floor(Math.random() * 40) + 60,
          source: 'SpamHaus',
          description: 'Email address used in spam campaigns',
          tags: ['spam', 'email'],
        },
      ];

      await this.storeThreatData(simulatedThreats);
      logger.info(`Stored ${simulatedThreats.length} threats from Phishing feeds simulation`);
    } catch (error) {
      logger.error('Error fetching from Phishing feeds simulation:', error);
    }
  }

  private async storeThreatData(threats: ThreatFeedItem[]): Promise<void> {
    const results = await Promise.allSettled(
      threats.map(async (threatData) => {
        try {
          const existingThreat = await Threat.findOne({
            where: {
              value: threatData.value,
              type: threatData.type,
            },
          });

          if (existingThreat) {
            // Update existing threat
            return existingThreat.update({
              ...threatData,
              lastSeen: new Date(),
            });
          }

          // Create new threat
          return Threat.create({
            ...threatData,
            firstSeen: new Date(),
            lastSeen: new Date(),
          });
        } catch (error) {
          logger.error(`Error storing threat ${threatData.value}:`, error);
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info(`Threat storage complete: ${successful} successful, ${failed} failed`);
  }

  private generateRandomHash(): string {
    return Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Manual trigger for testing
  async manualFetch(): Promise<void> {
    await this.fetchAllSources();
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}

export const threatIntelligenceService = new ThreatIntelligenceService();