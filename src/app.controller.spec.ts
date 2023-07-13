import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const serverInfo = {
    'API document': 'http://localhost:3000/doc',
    createdAt: '09/07/2023',
    server: 'Elder care',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return server information', () => {
      expect(appController.home()).toStrictEqual(serverInfo);
    });
  });
});
