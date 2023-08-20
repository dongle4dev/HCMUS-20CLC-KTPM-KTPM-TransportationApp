import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ChatboxesModule } from 'apps/chatboxes/src/chatboxes.module';
import { ChatboxesRepository } from 'apps/chatboxes/src/chatboxes.repository';
import { ChatboxesService } from 'apps/chatboxes/src/chatboxes.service';
import { ChatBoxSchema } from 'apps/chatboxes/src/schema/chatbox.schema';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
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
    ChatboxesModule,
    GatewayModule,
    RmqModule,
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
