import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService], // export so other modules can inject it
})
export class CacheModule {}
