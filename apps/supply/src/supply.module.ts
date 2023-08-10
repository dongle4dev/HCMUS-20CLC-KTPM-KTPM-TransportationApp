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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { HotlineSchema } from 'y/common/database/hotline/schema/hotline.schema';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema }]),
    MongooseModule.forFeature([{ name: 'Hotline', schema: HotlineSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
    // RedisModule,
    CacheModule.register({
      // store: 'memory',
      store: redisStore,
      host: 'redis-server',
      // host: 'localhost',
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
