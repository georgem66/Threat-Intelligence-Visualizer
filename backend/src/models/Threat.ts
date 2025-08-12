import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ThreatAttributes {
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

interface ThreatCreationAttributes extends Optional<ThreatAttributes, 'id' | 'destinationIp' | 'sourcePort' | 'destinationPort' | 'geolocation' | 'metadata' | 'count' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class Threat extends Model<ThreatAttributes, ThreatCreationAttributes> implements ThreatAttributes {
  public id!: number;
  public sourceIp!: string;
  public destinationIp?: string;
  public sourcePort?: number;
  public destinationPort?: number;
  public protocol!: string;
  public category!: 'malware' | 'phishing' | 'botnet' | 'spam' | 'scanning' | 'other';
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public confidence!: number;
  public description!: string;
  public source!: string;
  public geolocation?: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  public metadata?: Record<string, any>;
  public firstSeen!: Date;
  public lastSeen!: Date;
  public count!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Threat.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sourceIp: {
    type: DataTypes.INET,
    allowNull: false,
    validate: {
      isIP: true,
      notEmpty: true,
    },
  },
  destinationIp: {
    type: DataTypes.INET,
    allowNull: true,
    validate: {
      isIP: true,
    },
  },
  sourcePort: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 65535,
    },
  },
  destinationPort: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 65535,
    },
  },
  protocol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: DataTypes.ENUM('malware', 'phishing', 'botnet', 'spam', 'scanning', 'other'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  geolocation: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  firstSeen: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Threat',
  tableName: 'threats',
  timestamps: true,
  indexes: [
    {
      fields: ['sourceIp'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['source'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['firstSeen'],
    },
    {
      fields: ['lastSeen'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});
