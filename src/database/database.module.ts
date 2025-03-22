import { Global, Module } from '@nestjs/common';
import * as services from './services';

const Services = Object.values(services);
@Global()
@Module({
  imports: [],
  providers: [...Services],
  exports: [...Services],
})
export class DatabaseModule {}
