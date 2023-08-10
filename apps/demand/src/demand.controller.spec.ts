import { Test, TestingModule } from '@nestjs/testing';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

describe('DemandController', () => {
  let demandController: DemandController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DemandController],
      providers: [DemandService],
    }).compile();

    demandController = app.get<DemandController>(DemandController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(demandController.getHello()).toBe('Hello World!');
    });
  });
});
