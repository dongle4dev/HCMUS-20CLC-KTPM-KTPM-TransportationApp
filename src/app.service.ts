import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  homeInfo(): any {
    return {
      server: 'Elder care',
      createdAt: '09/07/2023',
      'API document': 'http://localhost:3000/doc',
    };
  }
}
