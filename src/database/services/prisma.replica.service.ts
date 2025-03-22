import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfig } from '../../config';

@Injectable()
export class ReplicaPrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private readonly logger = new Logger(ReplicaPrismaService.name);

  constructor(private readonly appConfig: AppConfig) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
      datasourceUrl: appConfig.replicaDatabaseUrl,
    });

    this.$on('query', (e) => {
      this.logger.debug(
        `query: ${e.query}, params: ${e.params}, duration: ${e.duration}ms`,
      );
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('query', async () => {
      await app.close();
    });
  }
}
