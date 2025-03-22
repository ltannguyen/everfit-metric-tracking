import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { MetricModule } from './modules';

@Module({
  imports: [ConfigModule, DatabaseModule, MetricModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
