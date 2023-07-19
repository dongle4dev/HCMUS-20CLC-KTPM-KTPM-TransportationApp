import { Controller, Get } from '@nestjs/common';
import { BankaccountService } from './bankaccount.service';

@Controller()
export class BankaccountController {
  constructor(private readonly bankaccountService: BankaccountService) {}

  @Get()
  getHello(): string {
    return this.bankaccountService.getHello();
  }
}
