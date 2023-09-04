import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { DemandSchema } from 'y/common/database/discovery/demand/schema/demand.schema';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { DriverSchema } from 'y/common/database/driver/schema/driver.schema';
import { HotlineSchema } from 'y/common/database/hotline/schema/hotline.schema';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { DEMAND_SERVICE, DRIVER_SERVICE } from 'y/common/constants/services';
import { DemandGateway } from './gateway/gateway';

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
    MongooseModule.forFeature([{ name: 'Demand', schema: DemandSchema }]),
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
    DemandGateway,
    RmqModule.register({
      name: DRIVER_SERVICE,
    }),
    RmqModule,
  ],
  controllers: [
    DemandController
  ],
  providers: [
    DemandService,
  ],
  exports: [
    DemandService
  ],
})
export class DemandModule {}
