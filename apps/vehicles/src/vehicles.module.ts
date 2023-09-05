import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { DriverSchema } from 'y/common/database/driver/schema/driver.schema';
import { HotlineSchema } from 'y/common/database/hotline/schema/hotline.schema';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { VehicleSchema } from 'y/common/database/vehicle/schema/vehicle.schema';

import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import * as Joi from 'joi';
import { RmqModule } from 'y/common/rmq/rmq.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_VEHICLE_QUEUE: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }]),
    RmqModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesRepository],
})
export class VehiclesModule {}
