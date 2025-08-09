import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import type { Analytics as AnalyticsInterface } from '../types';

export class Analytics extends Model<AnalyticsInterface> implements AnalyticsInterface {
  public id!: string;
  public date!: string;
  public threatCounts!: Record<string, number>;
  public severityCounts!: Record<string, number>;
  public countryCounts!: Record<string, number>;
  public sourceCounts!: Record<string, number>;
  public totalThreats!: number;
  public createdAt!: Date;
}

Analytics.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    threatCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    severityCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    countryCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    sourceCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    totalThreats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Analytics',
    tableName: 'analytics',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['date'],
      },
    ],
  }
);

export default Analytics;