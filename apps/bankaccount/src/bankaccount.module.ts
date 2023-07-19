import { Module } from '@nestjs/common';
import { BankaccountController } from './bankaccount.controller';
import { BankaccountService } from './bankaccount.service';

@Module({
  imports: [],
  controllers: [BankaccountController],
  providers: [BankaccountService],
})
export class BankaccountModule {}
