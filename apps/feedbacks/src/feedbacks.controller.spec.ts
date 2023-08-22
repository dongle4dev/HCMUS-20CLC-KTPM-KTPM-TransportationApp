import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';

describe('FeedbacksController', () => {
  let feedbacksController: FeedbacksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedbacksController],
      providers: [FeedbacksService],
    }).compile();

    feedbacksController = app.get<FeedbacksController>(FeedbacksController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(feedbacksController.getHello()).toBe('Hello World!');
    });
  });
});
