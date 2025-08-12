export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'analyst' | 'viewer';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Threat {
  id: number;
  sourceIp: string;
  destinationIp?: string;
  sourcePort?: number;
  destinationPort?: number;
  protocol: string;
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
  metadata?: Record<string, any>;
  firstSeen: Date;
  lastSeen: Date;
  count: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: number;
  metricName: string;
  metricValue: number;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ThreatQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  severity?: string;
  source?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardMetrics {
  totalThreats: number;
  activeThreats: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  recentThreats: Threat[];
  threatsByHour: Array<{
    hour: string;
    count: number;
  }>;
}

export interface GeographicData {
  geoData: Array<{
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    count: number;
    severity: string;
    category: string;
  }>;
}

export interface TimeSeriesData {
  timeSeries: Array<{
    timestamp: string;
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    categories: Record<string, number>;
  }>;
}
