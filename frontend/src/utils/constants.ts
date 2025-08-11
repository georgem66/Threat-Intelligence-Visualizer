/**
 * Application constants
 */

export const APP_CONFIG = {
  name: 'Threat Intelligence Visualizer',
  version: '1.0.0',
  description: 'A comprehensive platform for threat intelligence analysis and visualization',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  THREATS: '/threats',
  ANALYTICS: '/analytics',
} as const;

export const THREAT_TYPES = {
  IP: 'ip',
  DOMAIN: 'domain',
  URL: 'url',
  HASH: 'hash',
  EMAIL: 'email',
} as const;

export const THREAT_SEVERITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const THREAT_CATEGORIES = {
  MALWARE: 'malware',
  PHISHING: 'phishing',
  BOTNET: 'botnet',
  SPAM: 'spam',
  DDOS: 'ddos',
  BRUTEFORCE: 'bruteforce',
  OTHER: 'other',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export const COLORS = {
  SEVERITY: {
    [THREAT_SEVERITIES.CRITICAL]: '#DC2626',
    [THREAT_SEVERITIES.HIGH]: '#EA580C',
    [THREAT_SEVERITIES.MEDIUM]: '#D97706',
    [THREAT_SEVERITIES.LOW]: '#65A30D',
  },
  CATEGORY: {
    [THREAT_CATEGORIES.MALWARE]: '#DC2626',
    [THREAT_CATEGORIES.PHISHING]: '#EA580C',
    [THREAT_CATEGORIES.BOTNET]: '#D97706',
    [THREAT_CATEGORIES.SPAM]: '#65A30D',
    [THREAT_CATEGORIES.DDOS]: '#0891B2',
    [THREAT_CATEGORIES.BRUTEFORCE]: '#7C3AED',
    [THREAT_CATEGORIES.OTHER]: '#6B7280',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const TIMEFRAMES = {
  LAST_24_HOURS: '24h',
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
} as const;

export const STORAGE_KEYS = {
  THEME: 'darkMode',
  TOKEN: 'token',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  IP_ADDRESS: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  DOMAIN: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
} as const;
