import { Test, TestingModule } from '@nestjs/testing';
import { HotlineController } from './hotline.controller';
import { HotlineService } from './hotline.service';

describe('HotlineController', () => {
  let hotlineController: HotlineController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HotlineController],
      providers: [HotlineService],
    }).compile();

    hotlineController = app.get<HotlineController>(HotlineController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hotlineController.getHello()).toBe('Hello World!');
    });
  });
});
