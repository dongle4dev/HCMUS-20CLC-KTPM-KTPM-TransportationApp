import { Injectable } from '@nestjs/common';
import { RedisService as NestRedisService } from 'nestjs-redis';

@Injectable()
export class RedisService {
  constructor(private readonly nestRedisService: NestRedisService) {}

  getClient() {
    return this.nestRedisService.getClient();
  }
}
