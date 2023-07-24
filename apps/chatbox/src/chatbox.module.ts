import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminSchema } from 'apps/admin/src/schema/admin.schema';
import { CustomerSchema } from 'apps/customer/src/schema/customer.schema';
import { MessageSchema } from 'apps/message/src/schema/message.schema';
import { ChatboxController } from './chatbox.controller';
import { ChatboxService } from './chatbox.service';
import { UserInterceptor } from './interceptors/user.interceptor';
import { ChatBoxSchema } from './schema/chatbox.schema';
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
  ],
  controllers: [ChatboxController],
  providers: [
    ChatboxService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    UserJwtStrategy,
  ],
  exports: [UserJwtStrategy, PassportModule, ChatboxService],
})
export class ChatboxModule {}