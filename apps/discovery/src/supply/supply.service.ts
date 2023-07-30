import { Injectable, Inject } from '@nestjs/common';
import { StorePositionDto } from './dto/storePosition.dto';
import { SupplyRepository } from './supply.repository';
import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

@Injectable()
export class SupplyService {
  constructor(
    private readonly supplyRepository: SupplyRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis, // Inject the Redis client here
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Cron('*/1 * * * *') // Lên lịch thực hiện mỗi 10 phút
  async supplyPosition() {
    // console.log(storePositionDto);
    // Store the data in Redis using the address as the key
    // await this.redisClient.set(
    //   storePositionDto.address,
    //   JSON.stringify(storePositionDto),
    // );
    const userData = {
      latitude: 10.1234,
      longitude: 106.5678,
    };
    await this.cacheManager.set('driver', JSON.stringify(userData), {
      ttl: 60,
    });
    const redisData = await this.cacheManager.get('driver');
    console.log(redisData);
    console.log(`Data for driver updated in Redis.`);
    return { message: 'Position updated successfully' };
  }

  // async getUserFromRedis(): Promise<any> {
  //   // Get user data from Redis using the provided userId as the key
  //   const userDataString = await this.cacheManager.get<string>('driver');
  //   if (userDataString) {
  //     // Parse the JSON data back to an object and return it
  //     return JSON.parse(userDataString);
  //   } else {
  //     // If no data found for the userId, return null or handle it as needed
  //     return null;
  //   }
  // }

  // Manually trigger the cache update when the application starts
  async onApplicationBootstrap() {
    await this.supplyPosition();
  }
}
// sudo apt install redis-server
