import { Test, TestingModule } from '@nestjs/testing';
import { BankaccountsController } from './bankaccounts.controller';
import { BankaccountsService } from './bankaccounts.service';

describe('BankaccountsController', () => {
  let bankaccountsController: BankaccountsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BankaccountsController],
      providers: [BankaccountsService],
    }).compile();

    bankaccountsController = app.get<BankaccountsController>(BankaccountsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bankaccountsController.getHello()).toBe('Hello World!');
    });
  });
});
