export interface ThreatData {
  id?: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  category: 'malware' | 'phishing' | 'botnet' | 'spam' | 'ddos' | 'bruteforce' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  source: string;
  description?: string;
  firstSeen: Date;
  lastSeen: Date;
  geolocation?: {
    country?: string;
    countryCode?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface ThreatSource {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  isActive: boolean;
  lastFetch?: Date;
  fetchInterval: number; // in minutes
  format: 'json' | 'csv' | 'xml';
  parser: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id?: string;
  date: string; // YYYY-MM-DD format
  threatCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  countryCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  totalThreats: number;
  createdAt?: Date;
}

export interface Alert {
  id: string;
  threatId: string;
  userId?: string;
  type: 'new_threat' | 'severity_spike' | 'geographic_anomaly';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
}