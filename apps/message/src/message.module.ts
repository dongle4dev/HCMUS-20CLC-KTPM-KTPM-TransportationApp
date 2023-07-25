import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminSchema } from 'apps/admin/src/schema/admin.schema';
import { ChatboxModule } from 'apps/chatbox/src/chatbox.module';
import { ChatboxService } from 'apps/chatbox/src/chatbox.service';
import { ChatBoxSchema } from 'apps/chatbox/src/schema/chatbox.schema';
import { CustomerSchema } from 'apps/customer/src/schema/customer.schema';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
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
    ChatboxModule,
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    UserJwtStrategy,
  ],
  exports: [UserJwtStrategy, PassportModule],
})
export class MessageModule {}
