import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import {
  Hotline,
  HotlineSchema,
} from 'y/common/database/hotline/schema/hotline.schema';
import { HotlinesController } from './hotlines.controller';
import { HotlinesService } from './hotlines.service';
import * as Joi from 'joi';
import { DatabaseModule } from 'y/common';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { TRIP_SERVICE } from 'y/common/constants/services';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/hotlines/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Hotline.name, schema: HotlineSchema }]),
    RmqModule.register({
      name: TRIP_SERVICE,
    }),
    HttpModule
  ],
  controllers: [HotlinesController],
  providers: [
    HotlinesService,
    // HotlinesServiceFacade,
    HotlinesRepository,
  ],
  exports: [HotlinesRepository],
})
export class HotlinesModule {}
