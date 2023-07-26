import { Module } from '@nestjs/common';
import { BankaccountsController } from './bankaccounts.controller';
import { BankaccountsService } from './bankaccounts.service';

@Module({
  imports: [],
  controllers: [BankaccountsController],
  providers: [BankaccountsService],
})
export class BankaccountsModule {}
