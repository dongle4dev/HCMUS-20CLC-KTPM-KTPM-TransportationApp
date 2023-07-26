import { Test, TestingModule } from '@nestjs/testing';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

describe('CallsController', () => {
  let callsController: CallsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CallsController],
      providers: [CallsService],
    }).compile();

    callsController = app.get<CallsController>(CallsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(callsController.getHello()).toBe('Hello World!');
    });
  });
});
