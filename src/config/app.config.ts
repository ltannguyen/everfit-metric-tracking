import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type Environment =
  | 'local'
  | 'development'
  | 'test'
  | 'staging'
  | 'production';

export type Stage = 'dev' | 'test' | 'qa' | 'stag' | 'uat' | 'prod';

export const appSchema = {
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'test', 'staging', 'production')
    .default('development'),
  APP_NAME: Joi.string().default('NestJS App'),
  APP_PORT: Joi.number().default(5000),
  STAGE: Joi.string().default('dev'),
  SERVICE_NAME: Joi.string().default('metric_tracking_service'),
  DATABASE_URL: Joi.string().required(),
  REPLICA_DATABASE_URL: Joi.string().required(),
};

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  stage: process.env.STAGE,
  serviceName: process.env.SERVICE_NAME,
  databaseUrl: process.env.DATABASE_URL,
  replicaDatabaseUrl: process.env.REPLICA_DATABASE_URL,
}));

@Injectable()
export class AppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly env: Environment;
  public readonly stage: Stage;
  public readonly serviceName: string;
  public readonly databaseUrl: string;
  public readonly replicaDatabaseUrl: string;

  public get isLocal(): boolean {
    return this.env === 'local';
  }

  public get isProduction(): boolean {
    return this.env === 'production';
  }

  constructor(
    @Inject(appConfig.KEY)
    config: ConfigType<typeof appConfig>,
  ) {
    this.name = config.name!;
    this.port = Number(config.port);
    this.env = config.env as Environment;
    this.stage = config.stage as Stage;
    this.serviceName = config.serviceName!;
    this.databaseUrl = config.databaseUrl!;
    this.replicaDatabaseUrl = config.replicaDatabaseUrl!;
  }
}
