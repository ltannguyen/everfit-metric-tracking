import { GlobalExceptionFilter, TimeoutInterceptor } from '@common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApiConfig, AppConfig } from './config';
import { configureSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const { name, env, isProduction } = app.get(AppConfig);
  const { prefix, version } = app.get(ApiConfig);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());
  app.use(compression());
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true }));

  app.enableCors();
  app.enableVersioning();

  app.useGlobalFilters(
    new GlobalExceptionFilter({ includeSensitive: !isProduction }),
  );
  app.useGlobalInterceptors(new TimeoutInterceptor(50));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix(prefix);

  !isProduction &&
    configureSwagger(app, version, prefix, (builder) => {
      builder.setTitle(`${name} - ${env}`).setDescription(name);
    });

  const config = app.get(AppConfig);
  const server = await app.listen(config.port);

  server.keepAliveTimeout = 65 * 1000;
  server.headersTimeout = 66 * 1000;

  !isProduction && Logger.log(`${await app.getUrl()}/${prefix}/swagger`);

  return config;
}

bootstrap()
  .then((config: AppConfig) => {
    new Logger('Bootstrap').log(
      { config },
      `Server is listening on port ${config.port}, environment=${config.env}`,
    );
  })
  .catch((err) => {
    new Logger('Bootstrap').error(`Error starting server, ${err}`);
    throw err;
  });
