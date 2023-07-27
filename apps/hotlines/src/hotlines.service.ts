import { Injectable } from '@nestjs/common';

@Injectable()
export class HotlinesService {
  getHello(): string {
    return 'Hello World!';
  }
}
