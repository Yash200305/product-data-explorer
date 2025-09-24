import { Injectable } from '@nestjs/common';
import { CreateScrapeJobDto } from './dto/create-scrape-job.dto';
import { UpdateScrapeJobDto } from './dto/update-scrape-job.dto';

@Injectable()
export class ScrapeJobService {
  create(createScrapeJobDto: CreateScrapeJobDto) {
    return 'This action adds a new scrapeJob';
  }

  findAll() {
    return `This action returns all scrapeJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scrapeJob`;
  }

  update(id: number, updateScrapeJobDto: UpdateScrapeJobDto) {
    return `This action updates a #${id} scrapeJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} scrapeJob`;
  }
}
