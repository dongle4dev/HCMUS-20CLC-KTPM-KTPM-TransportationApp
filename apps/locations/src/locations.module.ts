import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { LocationsRepository } from 'y/common/database/location/repository/locations.repository';
import {
  Location,
  LocationSchema,
} from 'y/common/database/location/schema/location.schema';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { RmqModule } from 'y/common/rmq/rmq.module';
import * as Joi from 'joi';
import { DatabaseModule } from 'y/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TRACKING_SERVICE } from 'y/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_LOCATION_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/locations/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    RmqModule,
    RmqModule.register({
      name: TRACKING_SERVICE,
    }),
  ],
  controllers: [LocationsController],
  providers: [LocationsService, LocationsRepository],
})
export class LocationsModule {}
