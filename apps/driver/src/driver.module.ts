import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'y/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverRepository } from './driver.repository';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { Driver, DriverSchema } from './schemas/driver.schema';
import * as Joi from 'joi';
import { Mongoose } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required()
      }),
      envFilePath: './.env'
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema}])
  ],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
})
export class DriverModule {}
