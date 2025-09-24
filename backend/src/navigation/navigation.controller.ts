import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { CacheService } from '../common/cache/cache.service';
import { ScraperService } from '../scraper/scraper.service';

@Controller('api/navigation')
export class NavigationController {
  constructor(
    @InjectRepository(Navigation) private readonly navRepo: Repository<Navigation>,
    private readonly cache: CacheService,
    private readonly scraper: ScraperService,
  ) {}

  @Get()
  async list(@Query('refresh') refresh?: string) {
    const key = 'nav:list';
    if (!refresh) {
      const hit = this.cache.get<Navigation[]>(key);
      if (hit) return hit;
    }
    let items = await this.navRepo.find({ order: { title: 'ASC' } });
    if (refresh || !items?.length) {
      await this.scraper.scrapeNavigation();
      items = await this.navRepo.find({ order: { title: 'ASC' } });
    }
    this.cache.set(key, items, 1000 * 60 * 30);
    return items;
  }
}
