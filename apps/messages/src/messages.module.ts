import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminSchema } from 'apps/admins/src/schema/admin.schema';
import { ChatboxesModule } from 'apps/chatboxes/src/chatboxes.module';
import { ChatboxesRepository } from 'apps/chatboxes/src/chatboxes.repository';
import { ChatboxesService } from 'apps/chatboxes/src/chatboxes.service';
import { ChatBoxSchema } from 'apps/chatboxes/src/schema/chatbox.schema';
import { CustomerSchema } from 'apps/customers/src/schema/customer.schema';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { MessageController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MessageSchema } from './schema/message.schema';
import { UserJwtStrategy } from './strategies/user.jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'ChatBox', schema: ChatBoxSchema }]),
    ChatboxesModule,
  ],
  controllers: [MessageController],
  providers: [
    MessagesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    UserJwtStrategy,
    MessagesRepository,
    ChatboxesRepository,
  ],
  exports: [UserJwtStrategy, PassportModule],
})
export class MessagesModule {}
