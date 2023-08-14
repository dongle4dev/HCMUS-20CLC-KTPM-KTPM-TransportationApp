import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

describe('TrackingController', () => {
  let trackingController: TrackingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [TrackingService],
    }).compile();

    trackingController = app.get<TrackingController>(TrackingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(trackingController.getHello()).toBe('Hello World!');
    });
  });
});
