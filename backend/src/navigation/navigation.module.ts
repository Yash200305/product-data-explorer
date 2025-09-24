import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from './entities/navigation.entity';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { CacheModule } from '../common/cache/cache.module';   // provides CacheService
import { ScraperModule } from '../scraper/scraper.module';     // provides ScraperService

@Module({
  imports: [
    TypeOrmModule.forFeature([Navigation]),
    CacheModule,     // makes CacheService available here
    ScraperModule,   // makes ScraperService available here
  ],
  controllers: [NavigationController],
  providers: [NavigationService],
  exports: [TypeOrmModule],
})
export class NavigationModule {}
