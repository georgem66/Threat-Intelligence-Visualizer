import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import type { ThreatData as ThreatInterface } from '../types';

export class Threat extends Model<ThreatInterface> implements ThreatInterface {
  public id!: string;
  public type!: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  public value!: string;
  public category!: 'malware' | 'phishing' | 'botnet' | 'spam' | 'ddos' | 'bruteforce' | 'other';
  public severity!: 'critical' | 'high' | 'medium' | 'low';
  public confidence!: number;
  public source!: string;
  public description?: string;
  public firstSeen!: Date;
  public lastSeen!: Date;
  public geolocation?: {
    country?: string;
    countryCode?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  public metadata?: Record<string, any>;
  public tags?: string[];
}

Threat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('ip', 'domain', 'url', 'hash', 'email'),
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('malware', 'phishing', 'botnet', 'spam', 'ddos', 'bruteforce', 'other'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
      allowNull: false,
    },
    confidence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    geolocation: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Threat',
    tableName: 'threats',
    timestamps: true,
    indexes: [
      {
        fields: ['value'],
      },
      {
        fields: ['type'],
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
        fields: ['firstSeen'],
      },
      {
        fields: ['lastSeen'],
      },
      {
        name: 'threat_value_type_unique',
        unique: true,
        fields: ['value', 'type'],
      },
    ],
  }
);

export default Threat;