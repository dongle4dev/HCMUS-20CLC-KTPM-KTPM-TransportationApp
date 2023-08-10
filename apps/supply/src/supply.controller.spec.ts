import { Test, TestingModule } from '@nestjs/testing';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';

describe('SupplyController', () => {
  let supplyController: SupplyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SupplyController],
      providers: [SupplyService],
    }).compile();

    supplyController = app.get<SupplyController>(SupplyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(supplyController.getHello()).toBe('Hello World!');
    });
  });
});
