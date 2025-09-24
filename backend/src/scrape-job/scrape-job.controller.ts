import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScrapeJobService } from './scrape-job.service';
import { CreateScrapeJobDto } from './dto/create-scrape-job.dto';
import { UpdateScrapeJobDto } from './dto/update-scrape-job.dto';

@Controller('scrape-job')
export class ScrapeJobController {
  constructor(private readonly scrapeJobService: ScrapeJobService) {}

  @Post()
  create(@Body() createScrapeJobDto: CreateScrapeJobDto) {
    return this.scrapeJobService.create(createScrapeJobDto);
  }

  @Get()
  findAll() {
    return this.scrapeJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scrapeJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScrapeJobDto: UpdateScrapeJobDto) {
    return this.scrapeJobService.update(+id, updateScrapeJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scrapeJobService.remove(+id);
  }
}
