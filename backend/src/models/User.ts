import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import type { User as UserInterface } from '../types';

export class User extends Model<UserInterface> implements UserInterface {
  public id!: string;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'admin' | 'analyst' | 'viewer';
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastLoginAt?: Date;
  public isActive!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'analyst', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['username'],
      },
    ],
  }
);

export default User;