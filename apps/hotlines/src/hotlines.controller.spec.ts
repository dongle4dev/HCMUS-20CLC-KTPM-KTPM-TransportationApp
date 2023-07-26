import { Test, TestingModule } from '@nestjs/testing';
import { HotlinesController } from './hotlines.controller';
import { HotlinesService } from './hotlines.service';

describe('HotlinesController', () => {
  let hotlinesController: HotlinesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HotlinesController],
      providers: [HotlinesService],
    }).compile();

    hotlinesController = app.get<HotlinesController>(HotlinesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hotlinesController.getHello()).toBe('Hello World!');
    });
  });
});
