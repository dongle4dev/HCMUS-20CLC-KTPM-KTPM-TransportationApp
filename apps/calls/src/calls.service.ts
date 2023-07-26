import { Injectable } from '@nestjs/common';

@Injectable()
export class CallsService {
  getHello(): string {
    return 'Hello World!';
  }
}
