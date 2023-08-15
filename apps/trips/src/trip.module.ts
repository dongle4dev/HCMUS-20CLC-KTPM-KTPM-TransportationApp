import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip, TripSchema } from 'y/common/database/trip/schema/trip.schema';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { DriversModule } from 'apps/drivers/src/drivers.module';
import { RmqModule } from 'y/common/rmq/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    RmqModule,
  ],
  controllers: [TripController],
  providers: [TripService, TripRepository],
  exports: [TripService],
})
export class TripModule {}
