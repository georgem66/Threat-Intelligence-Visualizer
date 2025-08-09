import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';

interface DbConfigBase {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
}

interface DbConfigDev extends DbConfigBase {
  logging: (msg: string) => void;
}

interface DbConfigProd extends DbConfigBase {
  logging: false;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  ssl?: boolean;
  dialectOptions?: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

export const config = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'threat_intelligence_dev',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: (msg: string) => logger.debug(msg),
  } as DbConfigDev,
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    ssl: process.env.NODE_ENV === 'production',
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : undefined,
  } as DbConfigProd,
};

const env = (process.env.NODE_ENV || 'development') as keyof typeof config;
const dbConfig = config[env];

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    ...(env === 'production' && {
      pool: (dbConfig as DbConfigProd).pool,
      dialectOptions: (dbConfig as DbConfigProd).dialectOptions,
    }),
  }
);

export default sequelize;