import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { DEMAND_SERVICE, TRIP_SERVICE } from 'y/common/constants/services';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HotlinesServiceFacade } from './hotlines.facade.service';
import { EsmsService } from 'y/common/service/esms.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { HotlineJwtStrategy } from './strategies/hotline.jwt.strategy';
import { SmsService } from 'y/common/service/sms.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_HOTLINE_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/hotlines/.env',
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
    DatabaseModule,
    MongooseModule.forFeature([{ name: Hotline.name, schema: HotlineSchema }]),
    RmqModule.register({
      name: TRIP_SERVICE,
    }),
    RmqModule.register({
      name: DEMAND_SERVICE,
    }),
    RmqModule,
    HttpModule,
    CacheModule.register({
      // store: 'memory',
      store: redisStore,
      host: 'redis-server',
      // host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
  ],
  controllers: [HotlinesController],
  providers: [
    HotlinesService,
    HotlinesRepository,
    HotlinesServiceFacade,
    EsmsService,
    SmsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    HotlineJwtStrategy,
  ],
  exports: [HotlinesRepository],
})
export class HotlinesModule {}
