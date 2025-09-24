import { PartialType } from '@nestjs/swagger';
import { CreateScrapeJobDto } from './create-scrape-job.dto';

export class UpdateScrapeJobDto extends PartialType(CreateScrapeJobDto) {}
