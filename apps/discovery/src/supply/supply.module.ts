import { Module } from '@nestjs/common';
import { SupplyRepository } from './supply.repository';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Supply, SupplySchema } from './schemas/supply.schema';
import { RedisModuleClass } from '../redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
    RedisModuleClass,
    CacheModule.register({
      // store: 'memory',
      store: redisStore,
      host: 'redis-server',
      port: 6379,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [SupplyController],
  providers: [
    SupplyService,
    SupplyRepository,
    {
      provide: 'Redis', // Use the same identifier as in the RedisModule
      useExisting: 'REDIS_CLIENT', // Reference the Redis client provider from RedisModule
    },
  ],
  exports: [SupplyService],
})
export class SupplyModule {}
