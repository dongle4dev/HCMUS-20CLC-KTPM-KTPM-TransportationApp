import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Trip, TripSchema } from 'y/common/database/trip/schema/trip.schema';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import * as Joi from 'joi';
import { DatabaseModule } from 'y/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/tracking/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
