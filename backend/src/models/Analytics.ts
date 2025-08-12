import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AnalyticsAttributes {
  id: number;
  metricName: string;
  metricValue: number;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface AnalyticsCreationAttributes extends Optional<AnalyticsAttributes, 'id' | 'metadata' | 'createdAt' | 'updatedAt'> {}

export class Analytics extends Model<AnalyticsAttributes, AnalyticsCreationAttributes> implements AnalyticsAttributes {
  public id!: number;
  public metricName!: string;
  public metricValue!: number;
  public timeframe!: 'hour' | 'day' | 'week' | 'month';
  public timestamp!: Date;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Analytics.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  metricName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  metricValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.ENUM('hour', 'day', 'week', 'month'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
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
  modelName: 'Analytics',
  tableName: 'analytics',
  timestamps: true,
  indexes: [
    {
      fields: ['metricName'],
    },
    {
      fields: ['timeframe'],
    },
    {
      fields: ['timestamp'],
    },
    {
      fields: ['metricName', 'timeframe', 'timestamp'],
    },
  ],
});
