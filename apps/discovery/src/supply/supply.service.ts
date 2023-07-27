import { Injectable, Inject } from '@nestjs/common';
import { StorePositionDto } from './dto/storePosition.dto';
import { SupplyRepository } from './supply.repository';
import Redis from 'ioredis';

@Injectable()
export class SupplyService {
  constructor(
    private readonly supplyRepository: SupplyRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis, // Inject the Redis client here
  ) {}

  async supplyPosition(storePositionDto: StorePositionDto) {
    console.log(storePositionDto);

    // Store the data in Redis using the address as the key
    await this.redisClient.set(
      storePositionDto.address,
      JSON.stringify(storePositionDto),
    );
  }
}
