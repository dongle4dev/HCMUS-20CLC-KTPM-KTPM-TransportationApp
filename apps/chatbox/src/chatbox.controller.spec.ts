import { Test, TestingModule } from '@nestjs/testing';
import { ChatboxController } from './chatbox.controller';
import { ChatboxService } from './chatbox.service';

describe('ChatboxController', () => {
  let chatboxController: ChatboxController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatboxController],
      providers: [ChatboxService],
    }).compile();

    chatboxController = app.get<ChatboxController>(ChatboxController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatboxController.getHello()).toBe('Hello World!');
    });
  });
});
