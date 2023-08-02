import { Module } from '@nestjs/common';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { RedisModule } from 'y/common/module/redis.module';
import {
  Driver,
  DriverSchema,
} from 'y/common/database/driver/schema/driver.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import {
  Supply,
  SupplySchema,
} from 'y/common/database/discovery/supply/schema/supply.schema';
import { SupplyRepository } from 'y/common/database/discovery/supply/repository/supply.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
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
  providers: [SupplyService, SupplyRepository, DriversRepository],
  exports: [SupplyService],
})
export class SupplyModule {}
