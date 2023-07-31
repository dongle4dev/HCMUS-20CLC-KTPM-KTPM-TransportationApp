import { Module } from '@nestjs/common';
import { SupplyRepository } from './supply.repository';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Supply, SupplySchema } from './schemas/supply.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { RedisModule } from 'y/common/module/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
    // RedisModule,
    CacheModule.register({
      // store: 'memory',
      store: redisStore,
      // host: 'redis-server',
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [SupplyController],
  providers: [SupplyService, SupplyRepository],
  exports: [SupplyService],
})
export class SupplyModule {}
