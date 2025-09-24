import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeJobController } from './scrape-job.controller';
import { ScrapeJobService } from './scrape-job.service';

describe('ScrapeJobController', () => {
  let controller: ScrapeJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapeJobController],
      providers: [ScrapeJobService],
    }).compile();

    controller = module.get<ScrapeJobController>(ScrapeJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
