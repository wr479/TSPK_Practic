import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationFormatsController } from './participation-formats.controller';

describe('ParticipationFormatsController', () => {
  let controller: ParticipationFormatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationFormatsController],
    }).compile();

    controller = module.get<ParticipationFormatsController>(ParticipationFormatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
