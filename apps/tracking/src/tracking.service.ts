import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackingService {
  getHello(): string {
    return 'Hello World!';
  }
}
