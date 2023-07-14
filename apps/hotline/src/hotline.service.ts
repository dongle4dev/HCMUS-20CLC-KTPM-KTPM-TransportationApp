import { Injectable } from '@nestjs/common';

@Injectable()
export class HotlineService {
  getHello(): string {
    return 'Hello World!';
  }
}
