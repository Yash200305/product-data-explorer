import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeJobService } from './scrape-job.service';

describe('ScrapeJobService', () => {
  let service: ScrapeJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeJobService],
    }).compile();

    service = module.get<ScrapeJobService>(ScrapeJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
