import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip, TripSchema } from 'y/common/database/trip/schema/trip.schema';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { RmqModule } from 'y/common/rmq/rmq.module';
import * as Joi from 'joi';
import { DatabaseModule } from 'y/common';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from 'y/common/service/sms.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_TRIP_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/trips/.env',
    }),
    HttpModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    RmqModule,
  ],
  controllers: [TripController],
  providers: [TripService, TripRepository, SmsService],
})
export class TripModule {}
