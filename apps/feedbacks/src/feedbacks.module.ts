import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FeedBack,
  FeedBackSchema,
} from 'y/common/database/feedback/schema/feedback.schema';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { FeedBacksRepository } from 'y/common/database/feedback/repository/feedbacks.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_DRIVER_QUEUE: Joi.string().required(),
      }),
      // envFilePath: './apps/drivers/.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: FeedBack.name, schema: FeedBackSchema },
    ]),
    RmqModule,
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, FeedBacksRepository],
})
export class FeedbacksModule {}
