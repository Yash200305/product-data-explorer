import { Module } from '@nestjs/common';
import { ScrapeJobService } from './scrape-job.service';
import { ScrapeJobController } from './scrape-job.controller';

@Module({
  controllers: [ScrapeJobController],
  providers: [ScrapeJobService],
})
export class ScrapeJobModule {}
