import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { AdminsRepository } from 'y/common/database/admin/repository/admins.repository';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { DriverSchema } from 'y/common/database/driver/schema/driver.schema';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import { HotlineSchema } from 'y/common/database/hotline/schema/hotline.schema';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { VehicleSchema } from 'y/common/database/vehicle/schema/vehicle.schema';
import { AdminsController } from './admins.controller';
import { AdminsServiceFacade } from './admins.facade.service';
import { AdminsService } from './admins.service';
import { AdminJwtStrategy } from './strategies/admin.jwt.strategy';
import {
  DRIVER_SERVICE,
  HOTLINE_SERVICE,
  CUSTOMER_SERVICE,
  TRIP_SERVICE,
  VEHICLE_SERVICE,
  FEEDBACK_SERVICE,
  REPORT_SERVICE,
} from 'y/common/constants/services';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
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
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema }]),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: 'Hotline', schema: HotlineSchema }]),
    MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }]),
    CacheModule.register({
      // store: 'memory',
      store: redisStore,
      host: 'redis-server',
      // host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    RmqModule.register({
      name: DRIVER_SERVICE,
    }),
    RmqModule.register({
      name: CUSTOMER_SERVICE,
    }),
    RmqModule.register({
      name: HOTLINE_SERVICE,
    }),
    RmqModule.register({
      name: TRIP_SERVICE,
    }),
    RmqModule.register({
      name: VEHICLE_SERVICE,
    }),
    RmqModule.register({
      name: FEEDBACK_SERVICE,
    }),
    RmqModule.register({
      name: REPORT_SERVICE,
    }),
  ],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    AdminsServiceFacade,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    AdminJwtStrategy,
    AdminsRepository,
    CustomersRepository,
    DriversRepository,
    HotlinesRepository,
    VehiclesRepository,
  ],
  exports: [AdminJwtStrategy, PassportModule],
})
export class AdminsModule {}
