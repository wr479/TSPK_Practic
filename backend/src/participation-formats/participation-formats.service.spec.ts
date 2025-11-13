import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationFormatsService } from './participation-formats.service';

describe('ParticipationFormatsService', () => {
  let service: ParticipationFormatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipationFormatsService],
    }).compile();

    service = module.get<ParticipationFormatsService>(
      ParticipationFormatsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
