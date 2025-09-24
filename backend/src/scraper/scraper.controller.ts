// scraper.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ScraperService } from './scraper.service';

class ScrapeNavDto {
  @IsOptional() @IsUrl()
  baseUrl?: string;
}
class ScrapeCategoryDto {
  @IsString()
  url: string;
  @IsOptional()
  navigationId?: number;
}
class ScrapeProductsDto {
  @IsString()
  url: string;
}
class ScrapeProductDetailDto {
  @IsString()
  url: string;
}

@Controller('api/scrape')
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Post('navigation')
  scrapeNavigation(@Body() dto: ScrapeNavDto) {
    return this.scraper.scrapeNavigation(dto.baseUrl);
  }

  @Post('category')
  scrapeCategory(@Body() dto: ScrapeCategoryDto) {
    return this.scraper.scrapeCategory(dto.url, dto.navigationId);
  }

  @Post('products')
  scrapeProducts(@Body() dto: ScrapeProductsDto) {
    return this.scraper.scrapeProducts(dto.url);
  }

  @Post('product-detail')
  scrapeProductDetail(@Body() dto: ScrapeProductDetailDto) {
    return this.scraper.scrapeProductDetail(dto.url);
  }
}
