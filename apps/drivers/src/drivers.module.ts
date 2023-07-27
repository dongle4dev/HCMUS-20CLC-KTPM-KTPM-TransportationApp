import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'y/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversRepository } from './drivers.repository';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Driver, DriverSchema } from './schemas/driver.schema';
import * as Joi from 'joi';
import { Mongoose } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
  ],
  controllers: [DriversController],
  providers: [DriversService, DriversRepository],
})
export class DriversModule {}
