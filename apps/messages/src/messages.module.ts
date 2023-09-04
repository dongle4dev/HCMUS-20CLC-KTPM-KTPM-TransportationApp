import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { CUSTOMER_SERVICE, DRIVER_SERVICE } from 'y/common/constants/services';
import { MessagesRepository } from 'y/common/database/message/repository/messages.repository';
import { MessageSchema } from 'y/common/database/message/schema/message.schema';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { GatewayModule } from './gateway/gateway.module';
import { MessageController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    GatewayModule,
    RmqModule,
    RmqModule.register({
      name: CUSTOMER_SERVICE,
    }),
    RmqModule.register({
      name: DRIVER_SERVICE,
    }),
  ],
  controllers: [MessageController],
  providers: [
    MessagesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    MessagesRepository,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
