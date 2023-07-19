import { Injectable } from '@nestjs/common';

@Injectable()
export class CallService {
  getHello(): string {
    return 'Hello World!';
  }
}
