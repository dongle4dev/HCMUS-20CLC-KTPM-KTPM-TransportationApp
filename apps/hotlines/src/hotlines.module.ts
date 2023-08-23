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
import { SmsService } from 'y/common/service/sms.service';

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
  ],
  controllers: [HotlinesController],
  providers: [
    HotlinesService,
    HotlinesRepository,
    HotlinesServiceFacade,
    SmsService,
  ],
  exports: [HotlinesRepository],
})
export class HotlinesModule {}
