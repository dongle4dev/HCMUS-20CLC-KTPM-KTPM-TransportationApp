import { Controller, Get } from '@nestjs/common';
import { BankaccountsService } from './bankaccounts.service';

@Controller()
export class BankaccountsController {
  constructor(private readonly bankaccountsService: BankaccountsService) {}

  @Get()
  getHello(): string {
    return this.bankaccountsService.getHello();
  }
}
