import { Test, TestingModule } from '@nestjs/testing';
import { TariffsController } from './tariffs.controller';

describe('TariffsController', () => {
  let controller: TariffsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffsController],
    }).compile();

    controller = module.get<TariffsController>(TariffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
