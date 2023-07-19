import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatboxService {
  getHello(): string {
    return 'Hello World!';
  }
}
