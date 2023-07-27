import { Injectable } from '@nestjs/common';

@Injectable()
export class BankaccountsService {
  getHello(): string {
    return 'Hello World!';
  }
}
