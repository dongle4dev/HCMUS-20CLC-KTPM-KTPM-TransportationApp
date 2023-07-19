import { Test, TestingModule } from '@nestjs/testing';
import { BankaccountController } from './bankaccount.controller';
import { BankaccountService } from './bankaccount.service';

describe('BankaccountController', () => {
  let bankaccountController: BankaccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BankaccountController],
      providers: [BankaccountService],
    }).compile();

    bankaccountController = app.get<BankaccountController>(BankaccountController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bankaccountController.getHello()).toBe('Hello World!');
    });
  });
});
