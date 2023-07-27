import { Test, TestingModule } from '@nestjs/testing';
import { ChatboxesController } from './chatboxes.controller';
import { ChatboxesService } from './chatboxes.service';

describe('ChatboxesController', () => {
  let chatboxesController: ChatboxesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatboxesController],
      providers: [ChatboxesService],
    }).compile();

    chatboxesController = app.get<ChatboxesController>(ChatboxesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatboxesController.getHello()).toBe('Hello World!');
    });
  });
});
