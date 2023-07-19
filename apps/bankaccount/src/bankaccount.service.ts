import { Injectable } from '@nestjs/common';

@Injectable()
export class BankaccountService {
  getHello(): string {
    return 'Hello World!';
  }
}
