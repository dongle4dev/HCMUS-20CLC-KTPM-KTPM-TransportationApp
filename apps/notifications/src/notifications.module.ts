import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { NotificationSchema } from 'y/common/database/notification/schema/notification.schema';
import { NotificationsRepository } from 'y/common/database/notification/repository/notifications.repository';
import { NotificationTokenRepository } from 'y/common/database/notification/repository/notification-token.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_NOTIFICATION_QUEUE: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    RmqModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationTokenRepository,
  ],
})
export class NotificationsModule {}
